import React, { useState, useEffect } from "react";
import { Video, Loader2, Play, Pause } from "lucide-react";
import {
  createAsset,
  uploadAsset,
  generateVideo,
  pollVideoStatus,
  getAsset,
} from "../services/hedraService";
import { Character } from "../types";
import { createAudioFile } from "../services/elevenlabsService";

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
  const [existingVideoUrl, setExistingVideoUrl] = useState<string | null>(null);
  const [isPlayingNewVideo, setIsPlayingNewVideo] = useState(false);

  // Load existing video if character has video_id
  useEffect(() => {
    const loadExistingVideo = async () => {
      if (selectedCharacter?.idle_video_id) {
        try {
          const assetData = await getAsset(
            selectedCharacter.idle_video_id,
            "video"
          );
          if (assetData[0]?.asset?.url) {
            const url = assetData[0].asset.url;
            setExistingVideoUrl(url);
            // Only set as current video if we're not playing a new video
            if (!isPlayingNewVideo) {
              setVideoUrl(url);
            }
          }
        } catch (error) {
          console.error("Error loading existing video:", error);
        }
      }
    };

    loadExistingVideo();
  }, [selectedCharacter]);

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

      // Set the new video and mark that we're playing a new video
      setVideoUrl(url);
      setIsPlayingNewVideo(true);
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
        {videoUrl && (
          <div className="relative w-full max-w-[280px]">
            <div
              className="relative rounded-lg overflow-hidden shadow-lg"
              style={{ aspectRatio: "9/16" }}
            >
              <video
                key={videoUrl}
                src={videoUrl}
                autoPlay
                loop={!isPlayingNewVideo} // Loop only if playing existing video
                onEnded={() => {
                  // When new video ends, go back to existing video
                  if (isPlayingNewVideo && existingVideoUrl) {
                    setVideoUrl(existingVideoUrl);
                    setIsPlayingNewVideo(false);
                  }
                }}
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>

            {selectedCharacter?.name && (
              <div className="mt-2 text-center text-sm text-gray-600">
                {selectedCharacter.name}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Status bar */}
      {isGenerating && (
        <div className="text-center mb-1">
          <div className="flex justify-center">
            <div className="p-4 bg-indigo-100 rounded-full">
              <Loader2 className="h-8 w-8 text-indigo-600 animate-spin" />
            </div>
          </div>

          {/* Progress indicator */}
          {progress > 0 && (
            <div className="mx-2">
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
      )}
    </div>
  );
};

export default VideoPreview;
