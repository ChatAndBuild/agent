// import { makeProxyRequest } from "./proxyService";
import axios from "axios";

// Define interfaces for the voice objects returned by the Hedra API
interface HedraVoice {
  id: string;
  type: string;
  name: string;
  thumbnail_url: string;
  description: string | null;
  is_favorite: boolean;
  created_at: string;
  asset: {
    type: string;
    external_id: string;
    labels: Array<{
      name: string;
      value: string;
    }>;
    preview_url: string;
    source: string;
  };
}

// New voice format interface
interface SupportedVoice {
  voice_id: string;
  service: string;
  name: string;
  description: string;
  labels: {
    [key: string]: string;
  };
  preview_url: string;
  premium: boolean;
  user_id: string;
  created_at: string;
  updated_at: string;
}

const HEDRA_V2_AI_MODEL_ID = import.meta.env.VITE_HEDRA_V2_AI_MODEL_ID;

// const BACKEND_API_URL = "https://nfa-api.chatandbuild.com";
const BACKEND_API_URL = "http://localhost:3000";

// Get available elevenlabs voices
export const getAvailableVoices = async () => {
  try {
    const url = `${BACKEND_API_URL}/api/elevenlabs/voices`;
    const { data } = await axios.get(url);
    return data.data;
  } catch (error) {
    console.error("Error fetching voices:", error);
  }
};

// Create elevenlabs audio file
export const createAudioFile = async (voiceId: string, text: string) => {
  try {
    const url = `${BACKEND_API_URL}/api/elevenlabs/tts`;
    const { data } = await axios.post(url, { voiceId, text });
    return data;
  } catch (error) {
    console.error("Error creating autio file:", error);
  }
};

// Create hedra asset V2
export const createAsset = async (type: string, name: string) => {
  try {
    const url = `${BACKEND_API_URL}/api/hedra/assets`;
    const { data } = await axios.post(url, {
      name,
      type,
    });
    return data.data;
  } catch (error) {
    console.error("Error creating asset file:", error);
  }
};

// Upload asset V2
export const uploadAsset = async (id: string, name: string) => {
  try {
    const url = `${BACKEND_API_URL}/api/hedra/assets/upload`;
    const { data } = await axios.post(url, {
      name,
      id,
    });
    return data.data;
  } catch (error) {
    console.error("Error uploading asset file:", error);
  }
};

// Upload file
export const uploadFile = async (file: File, type: string) => {
  try {
    const url = `${BACKEND_API_URL}/api/uploads`;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("type", type);

    const { data } = await axios.post(url, formData);
    return data;
  } catch (error) {
    console.error("Error creating portrait:", error);
  }
};

// Create a video
export const generateVideo = async (
  start_keyframe_id: string,
  audio_id: string
) => {
  try {
    const url = `${BACKEND_API_URL}/api/hedra/generate`;
    const body = {
      type: "video",
      ai_model_id: HEDRA_V2_AI_MODEL_ID,
      start_keyframe_id,
      audio_id,
      generated_video_inputs: {
        text_prompt: "Speek generally.",
        resolution: "540p",
        aspect_ratio: "9:16",
      },
    };

    const { data } = await axios.post(url, body);
    console.log("Video generated:", data);
    return data.data;
  } catch (error) {
    console.error("Error generating video:", error);
  }
};
// poll video status
export const pollVideoStatus = async (id: string) => {
  let attempts = 0;
  while (true) {
    try {
      console.log(`Polling video status : ${id}, attempt: ${attempts + 1}`);

      const url = `${BACKEND_API_URL}/api/hedra/generate/${id}`;

      const { data } = await axios.get(url);
      console.log("Project status: ", data);

      if (data.data.status === "complete") {
        return data.data;
      } else if (data.data.status === "error") {
        throw new Error("character generation failed");
      }

      // Wait 2 seconds before polling again
      await new Promise((resolve) => setTimeout(resolve, 5000));
      attempts++;
    } catch (error) {
      console.error("Error polling character status:", error);
      throw error;
    }
  }
};
