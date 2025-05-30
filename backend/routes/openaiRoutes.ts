import express, { Request, Response, Router } from "express";
import axios, { AxiosResponse } from "axios";
import FormData from "form-data";
import { upload } from "./uploadRoutes";

const router: Router = express.Router();

const OPENAI_API_URL: string = "https://api.openai.com/v1/chat/completions";
const OPENAI_API_KEY: string = process.env.OPENAI_API_KEY || "";

// Chat completion
router.post("/chat", async (req: Request, res: Response): Promise<void> => {
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
});

// Whisper transcription
router.post(
  "/whisper",
  upload.single("audio"),
  async (req: Request, res: Response): Promise<void> => {
    try {
      if (!req.file) {
        res.status(400).json({
          success: false,
          error: "No audio file provided",
        });
        return;
      }

      if (!OPENAI_API_KEY) {
        res.status(500).json({
          success: false,
          error: "OpenAI API key not configured",
        });
        return;
      }

      // Create form data for OpenAI Whisper API
      const formData = new FormData();
      formData.append("file", req.file.buffer, {
        filename: "audio.webm",
        contentType: req.file.mimetype || "audio/webm",
      });
      formData.append("model", "whisper-1");

      const headers = {
        Authorization: `Bearer ${OPENAI_API_KEY}`,
        ...formData.getHeaders(),
      };

      const { data }: AxiosResponse = await axios.post(
        "https://api.openai.com/v1/audio/transcriptions",
        formData,
        { headers }
      );

      res.json({
        success: true,
        text: data.text,
      });
    } catch (error) {
      console.error("Error calling OpenAI Whisper API:", error);
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }
);

export { router as openaiRoutes };
