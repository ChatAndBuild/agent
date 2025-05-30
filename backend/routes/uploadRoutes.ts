import express, { Request, Response, Router } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";

const router: Router = express.Router();

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

// Interface definitions
interface UploadResponse {
  success: boolean;
  filename?: string;
  error?: string;
}

router.post(
  "/uploads",
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

export { router as uploadRoutes, upload };
