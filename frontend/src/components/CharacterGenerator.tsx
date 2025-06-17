import React, { useState, useEffect, useRef } from "react";
import {
  User,
  Upload,
  Play,
  Pause,
  RefreshCw,
  Check,
  X,
  Video,
  Save,
  Loader2,
} from "lucide-react";
import {
  createAsset,
  uploadFile,
  uploadAsset,
  generateVideo,
  pollVideoStatus,
  getAsset,
} from "../services/hedraService";
import { Character, Voice } from "../types";
import {
  createAudioFile,
  getAvailableVoices,
} from "../services/elevenlabsService";

interface CharacterGeneratorProps {
  onCharacterCreated: (character: Character) => void;
}

const BACKGROUND_NOISE = "41e7f709-a1ab-4ca9-90b6-0c098d4eae7f";

const CharacterGenerator: React.FC<CharacterGeneratorProps> = ({
  onCharacterCreated,
}) => {
  // Character state
  const [characterName, setCharacterName] = useState<string>("");
  const [characterDescription, setCharacterDescription] = useState<string>("");
  const [selectedVoice, setSelectedVoice] = useState<string>("");
  const [availableVoices, setAvailableVoices] = useState<Voice[]>([]);
  const [imageId, setImageId] = useState<string>("");
  const [audioId, setAudioId] = useState<string>("");
  const [imageUrl, setImageUrl] = useState<string>("");
  const [videoId, setVideoId] = useState<string>("");
  const [videoUrl, setVideoUrl] = useState<string>("");
  const [testScript, setTestScript] = useState(
    "Hello! I'm your AI assistant focused on competitive intelligence. How can I help you analyze market trends and competitor activities today?"
  );

  // Process state
  const [isCreating, setIsCreating] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isGeneratingAnimation, setIsGeneratingAnimation] = useState(false);
  const [isPreviewPlaying, setIsPreviewPlaying] = useState(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const [animationProgress, setAnimationProgress] = useState(0);
  const [animationStep, setAnimationStep] = useState<string>("");
  const [isGeneratingIdleVideo, setIsGeneratingIdleVideo] = useState(false);
  const [idleVideoProgress, setIdleVideoProgress] = useState(0);
  const [idleVideoStep, setIdleVideoStep] = useState<string>("");

  // Refs
  const previewAudioRef = useRef<HTMLAudioElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load voices and existing characters on component mount
  useEffect(() => {
    const loadInitialData = async () => {
      const storedImageId = localStorage.getItem("image_id") || "";
      const storedVideoId = localStorage.getItem("video_id") || "";

      setImageId(storedImageId);
      setVideoId(storedVideoId);
      setCharacterName(localStorage.getItem("character_name") || "");
      setCharacterDescription(
        localStorage.getItem("character_description") ||
          "An AI assistant focused on competitive intelligence, helping users analyze market trends and competitor activities."
      );

      // Load image URL if image ID exists
      if (storedImageId) {
        try {
          const assetData = await getAsset(storedImageId, "image");
          if (assetData[0]?.asset?.url) {
            setImageUrl(assetData[0].asset.url);
          }
        } catch (error) {
          console.error("Error loading image:", error);
        }
      }

      // Load video URL if video ID exists
      if (storedVideoId) {
        try {
          const assetData = await getAsset(storedVideoId, "video");
          if (assetData[0]?.asset?.url) {
            setVideoUrl(assetData[0].asset.url);
          }
        } catch (error) {
          console.error("Error loading video:", error);
        }
      }

      // Load voices
      try {
        const voices = await getAvailableVoices();
        setAvailableVoices(voices);
        if (voices.length > 0) {
          setSelectedVoice(localStorage.getItem("voice_id") || voices[0].id);
        }
      } catch (error) {
        console.error("Error fetching voices:", error);
        setError("Failed to load voices. Please try again.");
      }
    };

    loadInitialData();
  }, []);

  useEffect(() => {
    if (previewAudioRef.current) {
      const voice = availableVoices.find((item) => item.id == selectedVoice);
      console.log("Loading audio into preview player");
      previewAudioRef.current.src = voice?.preview_url!;
      previewAudioRef.current.load();
    }
  }, [selectedVoice]);

  // Toggle voice preview playback
  const togglePreviewPlayback = () => {
    if (previewAudioRef.current) {
      if (isPreviewPlaying) {
        previewAudioRef.current.pause();
        setIsPreviewPlaying(false);
      } else {
        console.log("Audio can play through now");
        const playPromise = previewAudioRef.current.play();

        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              console.log("Audio playback started successfully");
              setIsPreviewPlaying(true);
            })
            .catch((err) => {
              console.error("Error playing audio:", err);
              setError(
                "Failed to play audio. Please try again or check your browser settings."
              );
            });
        }
      }
    }
  };

  useEffect(() => {
    if (audioId?.length > 0 && imageId?.length > 0) {
      new Promise(async (resolve) => {
        try {
          // Create animation
          setAnimationStep("Generating video...");
          setAnimationProgress(60);
          console.log("Creating animation:", characterName);
          const { id } = await generateVideo(imageId, audioId);

          setAnimationStep("Processing video...");
          setAnimationProgress(80);
          const { url, asset_id } = await pollVideoStatus(id);

          setVideoUrl(url);
          setVideoId(asset_id);
          localStorage.setItem("video_id", asset_id);

          setAnimationProgress(100);
          setAnimationStep("Complete!");
          setSuccess("Animation created successfully!");

          // Reset progress after a delay
          setTimeout(() => {
            setAnimationProgress(0);
            setAnimationStep("");
          }, 2000);
        } catch (error) {
          console.error("Error creating animation:", error);
          setError("Failed to create animation. Please try again.");
          setAnimationProgress(0);
          setAnimationStep("");
        } finally {
          setIsGeneratingAnimation(false);
          resolve({});
        }
      });
    }
  }, [audioId]);

  // Handle file selection
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError("Image size should be less than 5MB");
        return;
      }

      setIsUploading(true);

      try {
        const { filename } = await uploadFile(file, "image");
        const { id, name } = await createAsset("image", filename);
        const { asset } = await uploadAsset(id, name);

        localStorage.setItem("image_id", id);
        localStorage.removeItem("idle_video_id");
        setImageId(id);
        setImageUrl(asset.url);
        setIsUploading(false);
      } catch (error) {
        console.error("Error uploading image:", error);
        setError("Failed to upload image. Please try again.");
        setIsUploading(false);
      }
    }
  };

  // Handle preview audio ended
  const handlePreviewAudioEnded = () => {
    setIsPreviewPlaying(false);
  };

  // Create character
  const handleCreateCharacter = async () => {
    if (!characterName.trim()) {
      setError("Please enter a character name");
      return;
    }

    if (!imageId) {
      setError("Please upload a character image");
      return;
    }

    setIsCreating(true);
    setError("");
    setSuccess("");

    try {
      if (!localStorage.getItem("idle_video_id")) {
        setIsGeneratingIdleVideo(true);
        setIdleVideoProgress(0);
        setIdleVideoStep("Generating idle video...");

        setIdleVideoProgress(30);
        setIdleVideoStep("Processing character image...");
        const { id } = await generateVideo(imageId, BACKGROUND_NOISE);

        setIdleVideoProgress(60);
        setIdleVideoStep("Rendering idle animation...");
        const { asset_id } = await pollVideoStatus(id);

        setIdleVideoProgress(90);
        setIdleVideoStep("Finalizing character...");
        localStorage.setItem("idle_video_id", asset_id);

        setIdleVideoProgress(100);
        setIdleVideoStep("Complete!");

        // Reset idle video progress after a delay
        setTimeout(() => {
          setIsGeneratingIdleVideo(false);
          setIdleVideoProgress(0);
          setIdleVideoStep("");
        }, 1000);
      }

      const idleVideoId = localStorage.getItem("idle_video_id");

      onCharacterCreated({
        name: characterName,
        description: characterDescription,
        voice_id: selectedVoice,
        image_id: imageId,
        video_id: videoId,
        idle_video_id: idleVideoId!,
      });

      setSuccess("Character created successfully!");
    } catch (error) {
      console.error("Error creating character:", error);
      setError("Failed to create character. Please try again.");
      setIsGeneratingIdleVideo(false);
      setIdleVideoProgress(0);
      setIdleVideoStep("");
    } finally {
      setIsCreating(false);
    }
  };

  // Create animation for testing
  const handleGenerateAnimation = async () => {
    setError("");
    setSuccess("");
    setIsGeneratingAnimation(true);
    setAnimationProgress(0);
    setAnimationStep("");

    try {
      // Create audio file
      setAnimationStep("Creating audio file...");
      setAnimationProgress(20);
      console.log("Creating audio file");
      const { filename } = await createAudioFile(selectedVoice, testScript);

      setAnimationStep("Creating audio asset...");
      setAnimationProgress(40);
      const { id, name } = await createAsset("audio", filename);

      setAnimationStep("Uploading audio...");
      setAnimationProgress(50);
      await uploadAsset(id, name);
      setAudioId(id);
    } catch (error) {
      console.error("Error creating audio file:", error);
      setAnimationProgress(0);
      setAnimationStep("");
      setIsGeneratingAnimation(false);
      setError("Failed to create audio file. Please try again.");
    }
  };

  // Reset form
  const handleReset = () => {
    setCharacterName("");
    setCharacterDescription(
      "An AI assistant focused on competitive intelligence, helping users analyze market trends and competitor activities."
    );
    setSelectedVoice(availableVoices.length > 0 ? availableVoices[0].id : "");
    setImageUrl("");
    setImageId("");
    setVideoUrl("");
    setVideoId("");
    setTestScript(
      "Hello! I'm your AI assistant focused on competitive intelligence. How can I help you analyze market trends and competitor activities today?"
    );
    setError("");
    setSuccess("");

    // Clear localStorage
    localStorage.removeItem("character_name");
    localStorage.removeItem("character_description");
    localStorage.removeItem("voice_id");
    localStorage.removeItem("image_id");
    localStorage.removeItem("video_id");
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Character Information */}
        <div className="bg-white rounded-lg shadow-md p-4 border border-indigo-100">
          <h3 className="text-lg font-semibold text-indigo-800 mb-4">
            Character Information
          </h3>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Character Name
              </label>
              <input
                type="text"
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900"
                placeholder="Enter character name"
                value={characterName}
                onChange={(e) => {
                  setCharacterName(e.target.value);
                  localStorage.setItem("character_name", e.target.value);
                }}
                disabled={isCreating}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Character Description
              </label>
              <textarea
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none text-gray-900"
                placeholder="Describe your character"
                rows={3}
                value={characterDescription}
                onChange={(e) => {
                  setCharacterDescription(e.target.value);
                  localStorage.setItem("character_description", e.target.value);
                }}
                disabled={isCreating}
              />
            </div>
          </div>
        </div>

        {/* Voice Selection */}
        <div className="bg-white rounded-lg shadow-md p-4 border border-indigo-100">
          <h3 className="text-lg font-semibold text-indigo-800 mb-4">
            Voice Selection
          </h3>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Select Voice
              </label>
              <div className="flex items-center">
                <select
                  className="flex-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900"
                  value={selectedVoice}
                  onChange={(e) => {
                    setSelectedVoice(e.target.value);
                    localStorage.setItem("voice_id", e.target.value);
                  }}
                  disabled={
                    isGeneratingAnimation || availableVoices.length === 0
                  }
                >
                  {availableVoices.length === 0 ? (
                    <option value="">Loading voices...</option>
                  ) : (
                    availableVoices.map((voice) => (
                      <option key={voice.id} value={voice.id}>
                        {voice.name} - {voice.language} ({voice.gender})
                      </option>
                    ))
                  )}
                </select>
              </div>
            </div>

            {/* Voice Preview */}
            <div>
              {/* Voice Preview Player */}
              {selectedVoice && (
                <div className="mt-2 flex items-center gap-2 p-3 bg-indigo-50 rounded-lg">
                  <button
                    className="p-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-colors"
                    onClick={togglePreviewPlayback}
                  >
                    {isPreviewPlaying ? (
                      <Pause className="h-4 w-4" />
                    ) : (
                      <Play className="h-4 w-4" />
                    )}
                  </button>

                  <div className="flex-1">
                    <div className="text-sm font-medium text-indigo-700">
                      Voice Preview
                    </div>
                    <div className="text-xs text-gray-500">
                      This is a preview of how this voice will sound.
                    </div>
                  </div>

                  <audio
                    ref={previewAudioRef}
                    onEnded={handlePreviewAudioEnded}
                    className="hidden"
                    controls
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Image Upload */}
        <div className="bg-white rounded-lg shadow-md p-4 border border-indigo-100">
          <h3 className="text-lg font-semibold text-indigo-800 mb-4">
            Character Image
          </h3>

          <div className="space-y-4">
            <div className="flex items-center justify-center">
              {imageUrl ? (
                <div
                  className="relative"
                  style={{ width: "200px", height: "356px" }}
                >
                  <img
                    src={imageUrl}
                    alt="Character preview"
                    className="absolute inset-0 w-full h-full object-cover rounded-lg border-2 border-indigo-300"
                  />
                  <button
                    className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 transform translate-x-1/3 -translate-y-1/3 z-10"
                    onClick={() => {
                      setImageUrl("");
                      setImageId("");
                      localStorage.removeItem("image_id");
                    }}
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <div className="w-32 h-32 border-2 border-dashed border-indigo-300 rounded-lg flex items-center justify-center bg-indigo-50">
                  <User className="h-12 w-12 text-indigo-300" />
                </div>
              )}
            </div>
            <div>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                ref={fileInputRef}
                onChange={handleFileChange}
                disabled={isUploading}
              />
              <button
                className={`w-full flex items-center justify-center gap-2 p-2 rounded-md transition-colors ${
                  !isUploading
                    ? "bg-indigo-100 text-indigo-700 rounded-md hover:bg-indigo-200"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
              >
                {isUploading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Upload className="h-4 w-4" />
                )}
                <span>Upload Image</span>
              </button>
              <p className="text-xs text-gray-500 mt-1">
                Max file size: 5MB. Recommended: square image.
              </p>
            </div>
          </div>
        </div>

        {/* Preview */}
        {imageId && (
          <div className="bg-white rounded-lg shadow-md p-4 border border-indigo-100">
            <h3 className="text-lg font-semibold text-indigo-800 mb-4">
              Preview
            </h3>

            <div className="space-y-4">
              <div className="flex justify-center">
                <div
                  className="relative"
                  style={{ width: "200px", height: "356px" }}
                >
                  <video
                    key={videoUrl}
                    src={videoUrl}
                    autoPlay
                    className="absolute inset-0 w-full h-full rounded-lg border border-indigo-200 object-cover"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Test Script
              </label>
              <textarea
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none text-gray-900"
                placeholder="Enter text for the character to speak"
                rows={3}
                value={testScript}
                onChange={(e) => setTestScript(e.target.value)}
                disabled={isGeneratingAnimation}
              />
            </div>
            <div className="space-y-4">
              {/* Progress indicator */}
              {isGeneratingAnimation && animationProgress > 0 && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">{animationStep}</span>
                    <span className="text-gray-600">{animationProgress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${animationProgress}%` }}
                    />
                  </div>
                </div>
              )}

              <div className="flex justify-center">
                <button
                  className={`flex-1 flex items-center justify-center gap-2 p-2 rounded-md transition-colors ${
                    !isGeneratingAnimation
                      ? "bg-indigo-600 text-white hover:bg-indigo-700"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
                  onClick={handleGenerateAnimation}
                  disabled={isGeneratingAnimation || !imageId}
                >
                  {isGeneratingAnimation ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Video className="h-4 w-4" />
                  )}
                  <span>Generate Test Animation</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Error and Success Messages */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
            <X className="h-5 w-5 text-red-500" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center gap-2">
            <Check className="h-5 w-5 text-green-500" />
            <span>{success}</span>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="p-4 border-t border-gray-200 bg-gray-50">
        <div className="flex gap-3">
          <button
            className="flex-1 flex items-center justify-center gap-2 p-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            onClick={handleReset}
            disabled={isGeneratingAnimation || isCreating}
          >
            <RefreshCw className="h-4 w-4" />
            <span>Reset</span>
          </button>

          <button
            className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-lg transition-colors ${
              isCreating
                ? "bg-indigo-400 text-white cursor-not-allowed"
                : "bg-indigo-600 text-white hover:bg-indigo-700"
            }`}
            onClick={handleCreateCharacter}
            disabled={
              isCreating || !characterName || !characterDescription || !imageId
            }
          >
            {isCreating ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <User className="h-4 w-4" />
            )}
            <span>{isCreating ? "Creating..." : "Use Character"}</span>
          </button>
        </div>
      </div>

      {/* Loading Overlay for Idle Video Generation */}
      {isGeneratingIdleVideo && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50">
          <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="text-center">
              <div className="mb-4">
                <Loader2 className="h-12 w-12 animate-spin text-indigo-600 mx-auto" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Creating Character
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Please wait while we generate your character's idle animation...
              </p>

              {/* Progress indicator */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">{idleVideoStep}</span>
                  <span className="text-gray-600">{idleVideoProgress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${idleVideoProgress}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CharacterGenerator;
