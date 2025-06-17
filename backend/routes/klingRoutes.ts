import express, { Request, Response, Router } from "express";
import axios, { AxiosResponse } from "axios";
import * as jwt from "jsonwebtoken";

const router: Router = express.Router();

const KLING_API_ACCESS_KEY: string = process.env.KLING_API_ACCESS_KEY || "";
const KLING_API_SECRET_KEY: string = process.env.KLING_API_SECRET_KEY || "";

// function encodeJwtToken(ak: string, sk: string) {
//       const headers = {
//           alg: "HS256",
//           typ: "JWT"
//       };
//       const payload = {
//           iss: ak,
//           exp: Math.floor(Date.now() / 1000) + 1800, // The valid time, in this example, represents the current time+1800s(30min)
//           nbf: Math.floor(Date.now() / 1000) - 5 // The time when it starts to take effect, in this example, represents the current time minus 5s
//       };
//       const token = jwt.sign(payload, sk, { headers });
//       return token;
//   }

// Chat completion
router.post("/chat", async (req: Request, res: Response): Promise<void> => {
  // const authorization = encodeJwtToken(KLING_API_ACCESS_KEY, KLING_API_SECRET_KEY);
  // console.log(authorization); // Printing the generated API_TOKEN
  // try {
  //   const {
  //     messages,
  //     model = "claude-sonnet-4-20250514",
  //     temperature = 0.7,
  //     max_tokens = 1000,
  //     system,
  //   } = req.body;
  //   if (!ANTHROPIC_API_KEY) {
  //     res.status(500).json({
  //       success: false,
  //       error: "Anthropic API key not configured",
  //     });
  //     return;
  //   }
  //   const headers = {
  //     "Content-Type": "application/json",
  //     "x-api-key": ANTHROPIC_API_KEY,
  //     "anthropic-version": "2023-06-01",
  //   };
  //   const { data }: AxiosResponse = await axios.post(
  //     ANTHROPIC_API_URL,
  //     {
  //       model,
  //       messages,
  //       max_tokens,
  //       temperature,
  //       system,
  //     },
  //     { headers }
  //   );
  //   res.json({
  //     success: true,
  //     data,
  //   });
  // } catch (error) {
  //   console.error("Error calling Anthropic API:", error);
  //   res.status(500).json({
  //     success: false,
  //     error: error instanceof Error ? error.message : "Unknown error",
  //   });
  // }
});

export { router as klingRoutes };
