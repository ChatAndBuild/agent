import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Import routes
import { uploadRoutes } from "./routes/uploadRoutes";
import { hedraRoutes } from "./routes/hedraRoutes";
import { elevenLabsRoutes } from "./routes/elevenLabsRoutes";
import { openaiRoutes } from "./routes/openaiRoutes";
import { anthropicRoutes } from "./routes/anthropicRoutes";
import { klingRoutes } from "./routes/klingRoutes";

const app = express();
const PORT: number = 3000;

app.use(cors());

// Middleware - Configure request size limits
app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ limit: "5mb", extended: true }));
app.use(bodyParser.json({ limit: "5mb" }));
app.use(bodyParser.urlencoded({ limit: "5mb", extended: true }));

// Mount routes
app.use("/api", uploadRoutes);
app.use("/api/hedra", hedraRoutes);
app.use("/api/elevenlabs", elevenLabsRoutes);
app.use("/api/openai", openaiRoutes);
app.use("/api/anthropic", anthropicRoutes);
app.use("/api/kling", klingRoutes);

// Start the server
app.listen(PORT, (): void => {
  console.log(`Server running on http://localhost:${PORT}`);
});
