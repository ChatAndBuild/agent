import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import axios, { AxiosResponse } from "axios";
import cors from "cors";
import multer from "multer";
import path from "path";
import FormData from "form-data";
import fs from "fs";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const app = express();
const PORT: number = 3000;

const HEDRA_V2_API_URL: string = "https://api.hedra.com/web-app/public";
const HEDRA_V2_API_KEY: string = process.env.HEDRA_V2_API_KEY || "";

const ELEVEN_API_URL: string = "https://api.elevenlabs.io";
const ELEVEN_API_KEY: string = process.env.ELEVEN_API_KEY || "";

const OPENAI_API_URL: string = "https://api.openai.com/v1/chat/completions";
const OPENAI_API_KEY: string = process.env.OPENAI_API_KEY || "";

const ANTHROPIC_API_URL: string = "https://api.anthropic.com/v1/messages";
const ANTHROPIC_API_KEY: string = process.env.ANTHROPIC_API_KEY || "";

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB file size limit
    fieldSize: 5 * 1024 * 1024, // 5MB field size limit
    files: 10, // Maximum number of files
    parts: 100, // Maximum number of parts
  },
});

app.use(cors());

// Middleware - Configure request size limits
app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ limit: "5mb", extended: true }));
app.use(bodyParser.json({ limit: "5mb" }));
app.use(bodyParser.urlencoded({ limit: "5mb", extended: true }));

// Interface definitions
interface UploadResponse {
  success: boolean;
  filename?: string;
  error?: string;
}

interface HedraAssetResponse {
  data: any;
}

interface ElevenLabsVoice {
  voice_id: string;
  name: string;
  fine_tuning?: {
    language?: string;
  };
  voice_verification?: {
    language?: string;
  };
  labels?: {
    gender?: string;
  };
  preview_url?: string;
}

interface ElevenLabsVoicesResponse {
  voices: ElevenLabsVoice[];
}

interface MappedVoice {
  id: string;
  name: string;
  language: string;
  gender: string;
  preview_url?: string;
}

interface TTSRequest {
  voiceId: string;
  text: string;
}

interface TTSResponse {
  success: boolean;
  filename?: string;
  error?: string;
}

app.post(
  "/api/uploads",
  upload.single("file"),
  async (req: Request, res: Response): Promise<void> => {
    try {
      // Check if file exists in request
      if (!req.file) {
        res.status(400).json({
          success: false,
          error: "No file uploaded",
        } as UploadResponse);
        return;
      }

      // Create uploads directory if it doesn't exist
      if (!fs.existsSync("./uploads")) {
        fs.mkdirSync("./uploads");
      }

      // Generate filename with timestamp
      const filename: string = `${
        req.body.type
      }-${new Date().getTime()}${path.extname(req.file.originalname)}`;
      const filePath: string = path.join("./uploads", filename);

      // Write the file to disk
      fs.writeFileSync(filePath, req.file.buffer);

      // Return the file path in the response
      res.json({
        success: true,
        filename,
      } as UploadResponse);
    } catch (error) {
      console.error("Error uploading file:", error);
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      } as UploadResponse);
    }
  }
);

// Hedra APIs
app.post(
  "/api/hedra/assets",
  async (req: Request, res: Response): Promise<void> => {
    try {
      const body = req.body;
      const url: string = `${HEDRA_V2_API_URL}/assets`;
      const headers = {
        "X-API-Key": HEDRA_V2_API_KEY,
      };

      const { data }: AxiosResponse = await axios.post(url, body, { headers });
      res.json({ data } as HedraAssetResponse);
    } catch (error) {
      console.error("Error creating assets:", error);
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }
);

app.get(
  "/api/hedra/assets/:id/:type",
  async (req: Request, res: Response): Promise<void> => {
    try {
      const id = req.params.id;
      const type = req.params.type;
      const url: string = `${HEDRA_V2_API_URL}/assets?ids=${id}&type=${type}`;
      const headers = {
        "X-API-Key": HEDRA_V2_API_KEY,
      };

      const { data }: AxiosResponse = await axios.get(url, { headers });
      res.json({ data } as HedraAssetResponse);
    } catch (error) {
      console.error("Error creating assets:", error);
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }
);

app.post(
  "/api/hedra/assets/upload",
  async (req: Request, res: Response): Promise<void> => {
    try {
      const id: string = req.body.id;
      const filename: string = req.body.name;
      const filePath: string = path.join("./uploads", filename);

      // Create a readable stream from the file
      const fileStream = fs.createReadStream(filePath);

      // Determine content type based on file extension
      const ext: string = path.extname(filename).toLowerCase();
      let contentType: string = "application/octet-stream"; // Default content type

      if (ext === ".png") contentType = "image/png";
      else if (ext === ".jpg" || ext === ".jpeg") contentType = "image/jpeg";
      else if (ext === ".gif") contentType = "image/gif";
      else if (ext === ".mp4") contentType = "video/mp4";
      else if (ext === ".mp3") contentType = "audio/mpeg";
      else if (ext === ".wav") contentType = "audio/wav";

      const formData = new FormData();
      formData.append("file", fileStream, {
        filename,
        contentType,
      });

      const url: string = `${HEDRA_V2_API_URL}/assets/${id}/upload`;
      const headers = {
        "X-API-Key": HEDRA_V2_API_KEY,
        ...formData.getHeaders(),
      };

      const { data }: AxiosResponse = await axios.post(url, formData, {
        headers,
      });
      res.json({ data } as HedraAssetResponse);
    } catch (error) {
      console.error("Error upload assets:", error);
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }
);

app.post(
  "/api/hedra/generate",
  async (req: Request, res: Response): Promise<void> => {
    try {
      const body = req.body;
      const url: string = `${HEDRA_V2_API_URL}/generations`;
      const headers = {
        "X-API-Key": HEDRA_V2_API_KEY,
      };

      const { data }: AxiosResponse = await axios.post(url, body, { headers });
      res.json({ data } as HedraAssetResponse);
    } catch (error) {
      console.error("Error generating video: ", error);
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }
);

app.get(
  "/api/hedra/generate/:id",
  async (req: Request, res: Response): Promise<void> => {
    try {
      const id: string = req.params.id;
      const url: string = `${HEDRA_V2_API_URL}/generations/${id}/status`;
      const headers = {
        "X-API-Key": HEDRA_V2_API_KEY,
      };

      const { data }: AxiosResponse = await axios.get(url, { headers });
      res.json({ data } as HedraAssetResponse);
    } catch (error) {
      console.error("Error video status check: ", error);
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }
);

// ElevenLabs APIs
app.get(
  "/api/elevenlabs/voices",
  async (req: Request, res: Response): Promise<void> => {
    try {
      const url: string = `${ELEVEN_API_URL}/v2/voices?page_size=100`;
      const headers = {
        "xi-api-key": ELEVEN_API_KEY,
        "Content-Type": "application/json",
      };
      const { data }: AxiosResponse<ElevenLabsVoicesResponse> = await axios.get(
        url,
        { headers }
      );
      if (data && data.voices) {
        // Map the new API response format to match the expected format in the application
        res.json({
          data: data.voices.map((voice: ElevenLabsVoice): MappedVoice => {
            // Extract language and gender from labels if they exist
            const language: string =
              voice.fine_tuning?.language ||
              voice.voice_verification?.language ||
              "English";
            const gender: string = voice.labels?.gender || "Neutral";

            return {
              id: voice.voice_id,
              name: voice.name,
              language: language,
              gender: gender,
              preview_url: voice.preview_url,
            };
          }),
        });
      } else {
        res.json({ data: [] });
      }
    } catch (error) {
      console.error("Error get voices: ", error);
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }
);

app.post(
  "/api/elevenlabs/tts",
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { voiceId, text }: TTSRequest = req.body;
      const url: string = `${ELEVEN_API_URL}/v1/text-to-speech/${voiceId}`;
      const headers = {
        "xi-api-key": ELEVEN_API_KEY,
        "Content-Type": "application/json",
      };

      // Get audio data with responseType as arraybuffer to handle binary data
      const response: AxiosResponse<ArrayBuffer> = await axios.post(
        url,
        { text },
        {
          headers,
          responseType: "arraybuffer",
        }
      );

      // Create uploads directory if it doesn't exist
      if (!fs.existsSync("./uploads")) {
        fs.mkdirSync("./uploads");
      }

      // Generate filename and path
      const filename: string = `audio-${new Date().getTime()}.wav`;
      const filePath: string = path.join("./uploads", filename);

      // Write the audio data to a file
      fs.writeFileSync(filePath, Buffer.from(response.data));

      // Return the file path in the response
      res.json({
        success: true,
        filename,
      } as TTSResponse);
    } catch (error) {
      console.error("Error text to speech: ", error);
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      } as TTSResponse);
    }
  }
);

// OpenAI API endpoint
app.post(
  "/api/openai/chat",
  async (req: Request, res: Response): Promise<void> => {
    try {
      const {
        messages,
        model = "gpt-4o",
        temperature = 0.7,
        max_tokens = 1000,
      } = req.body;

      if (!OPENAI_API_KEY) {
        res.status(500).json({
          success: false,
          error: "OpenAI API key not configured",
        });
        return;
      }

      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      };

      const { data }: AxiosResponse = await axios.post(
        OPENAI_API_URL,
        {
          model,
          messages,
          temperature,
          max_tokens,
          stream: false,
        },
        { headers }
      );

      res.json({
        success: true,
        data,
      });
    } catch (error) {
      console.error("Error calling OpenAI API:", error);
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }
);

// Anthropic API endpoint
app.post(
  "/api/anthropic/chat",
  async (req: Request, res: Response): Promise<void> => {
    try {
      const {
        messages,
        model = "claude-sonnet-4-20250514",
        temperature = 0.7,
        max_tokens = 1000,
        system,
      } = req.body;

      if (!ANTHROPIC_API_KEY) {
        res.status(500).json({
          success: false,
          error: "Anthropic API key not configured",
        });
        return;
      }

      const headers = {
        "Content-Type": "application/json",
        "x-api-key": ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      };

      const { data }: AxiosResponse = await axios.post(
        ANTHROPIC_API_URL,
        {
          model,
          messages,
          max_tokens,
          temperature,
          system,
        },
        { headers }
      );

      res.json({
        success: true,
        data,
      });
    } catch (error) {
      console.error("Error calling Anthropic API:", error);
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }
);

// Start the server
app.listen(PORT, (): void => {
  console.log(`Server running on http://localhost:${PORT}`);
});
