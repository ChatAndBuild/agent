import React, { useState, useEffect } from "react";
import { Video, Loader2, Play, Pause } from "lucide-react";
import {
  createAudioFile,
  createAsset,
  uploadAsset,
  generateVideo,
  pollVideoStatus,
  getAsset,
} from "../services/hedraService";
import { Character } from "../types";

interface VideoPreviewProps {
  aiResponse?: string;
  selectedCharacter?: Character;
}

const VideoPreview: React.FC<VideoPreviewProps> = ({
  aiResponse,
  selectedCharacter,
}) => {
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [step, setStep] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);
  const [videoRef, setVideoRef] = useState<HTMLVideoElement | null>(null);

  // Load existing video if character has video_id
  useEffect(() => {
    const loadExistingVideo = async () => {
      if (selectedCharacter?.video_id) {
        try {
          const assetData = await getAsset(selectedCharacter.video_id, "video");
          if (assetData[0]?.asset?.url) {
            setVideoUrl(assetData[0].asset.url);
          }
        } catch (error) {
          console.error("Error loading existing video:", error);
        }
      }
    };

    loadExistingVideo();
  }, [selectedCharacter]);

  // Auto-play video when loaded
  useEffect(() => {
    if (videoUrl && videoRef) {
      videoRef.load();
      setIsPlaying(true);
    }
  }, [videoUrl, videoRef]);

  // Generate video when AI response is received
  useEffect(() => {
    if (
      aiResponse &&
      selectedCharacter &&
      selectedCharacter.voice_id &&
      selectedCharacter.image_id
    ) {
      generateVideoFromResponse();
    }
  }, [aiResponse]);

  const generateVideoFromResponse = async () => {
    if (!selectedCharacter || !aiResponse) return;

    setIsGenerating(true);
    setProgress(0);
    setStep("");

    try {
      // Use image ID from selected character
      const imageId = selectedCharacter.image_id;
      if (!imageId) {
        throw new Error("No character image found");
      }

      // Create audio file
      setStep("Creating audio file...");
      setProgress(20);
      const { filename } = await createAudioFile(
        selectedCharacter.voice_id,
        aiResponse
      );

      setStep("Creating audio asset...");
      setProgress(40);
      const { id: audioId, name } = await createAsset("audio", filename);

      setStep("Uploading audio...");
      setProgress(50);
      await uploadAsset(audioId, name);

      // Generate video
      setStep("Generating video...");
      setProgress(60);
      const { id: videoId } = await generateVideo(imageId, audioId);

      setStep("Processing video...");
      setProgress(80);
      const { url } = await pollVideoStatus(videoId);

      setVideoUrl(url);
      setProgress(100);
      setStep("Complete!");

      // Reset progress after a delay
      setTimeout(() => {
        setProgress(0);
        setStep("");
      }, 2000);
    } catch (error) {
      console.error("Error generating video:", error);
      setStep("Error generating video");
      setProgress(0);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 flex items-center justify-center p-4">
        {videoUrl ? (
          <div className="relative w-full max-w-[280px]">
            <div
              className="relative rounded-lg overflow-hidden shadow-lg"
              style={{ aspectRatio: "9/16" }}
            >
              <video
                ref={(ref) => setVideoRef(ref)}
                key={videoUrl}
                src={videoUrl}
                autoPlay
                className="absolute inset-0 w-full h-full object-cover"
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
              />
            </div>

            {selectedCharacter?.name && (
              <div className="mt-2 text-center text-sm text-gray-600">
                {selectedCharacter.name}
              </div>
            )}
          </div>
        ) : isGenerating ? (
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <div className="p-4 bg-indigo-100 rounded-full">
                <Loader2 className="h-8 w-8 text-indigo-600 animate-spin" />
              </div>
            </div>

            {/* Progress indicator */}
            {progress > 0 && (
              <div className="space-y-2 w-64">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">{step}</span>
                  <span className="text-gray-600">{progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center space-y-3">
            <div className="flex justify-center">
              <div className="p-4 bg-gray-100 rounded-full">
                <Video className="h-8 w-8 text-gray-400" />
              </div>
            </div>
            <div className="text-gray-500">
              <p className="text-sm font-medium">No video yet</p>
              <p className="text-xs mt-1">
                Send a message to generate a video response
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Status bar */}
      <div className="p-3 border-t border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between text-xs text-gray-600">
          <div className="flex items-center gap-2">
            <Video className="h-3 w-3" />
            <span>Video Preview</span>
          </div>
          {videoUrl && (
            <span className="text-green-600 flex items-center gap-1">
              <div className="w-2 h-2 bg-green-600 rounded-full animate-pulse" />
              Ready
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default VideoPreview;
