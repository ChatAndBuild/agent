// This avoids CORS issues by using direct API calls through a proxy server

import { MemoryBlock, MESSAGE_TYPE } from "../types";
import { makeProxyRequest } from "./proxyService";

const API_BASE_URL = import.meta.env.VITE_LETTA_API_SERVER_URL;
const AGENT_ID = import.meta.env.VITE_AGENT_ID;

// Helper function to handle API errors
const handleApiError = (error: any, message: string) => {
  console.error(`${message}:`, error);
  throw new Error(`${message}: ${error.message || "Unknown error"}`);
};

// Retrieve Agent Context Window using proxy
export const getContextWindow = async () => {
  try {
    const url = `${API_BASE_URL}/v1/agents/${AGENT_ID}/context`;
    const { data } = await makeProxyRequest(url, "GET");

    return data;
  } catch (error) {
    console.error("Error fetching context window", error);
    throw error;
    // return {
    //   contextWindowSizeCurrent: 1000,
    //   contextWindowSizeMax: 10000,
    // };
  }
};

// Get agent information using proxy
export const getAgentInfo = async () => {
  try {
    const url = `${API_BASE_URL}/v1/agents/${AGENT_ID}`;
    return await makeProxyRequest(url, "GET");
  } catch (error) {
    console.error("Error fetching agent info:", error);
    throw error;
  }
};

// Retrieve agent messages using proxy
export const getMessages = async (limit: number = 10, before?: string) => {
  try {
    let url = `${API_BASE_URL}/v1/agents/${AGENT_ID}/messages?limit=${limit}`;
    if (before) {
      url += `&before=${before}`;
    }

    const { data } = await makeProxyRequest(url, "GET");
    const messages: any[] = [];
    data.forEach((message: any) => {
      switch (message.message_type) {
        case MESSAGE_TYPE.USER_MESSAGE:
          if (!message.content.includes("heartbeat")) {
            messages.push(message);
          }
          break;
        case MESSAGE_TYPE.ASSISTANT_MESSAGE:
          messages.push(message);
          break;
        default:
          break;
      }
    });
    return messages;
  } catch (error) {
    console.error("Error fetching agent messages:", error);
    // Return empty array if there's an error
    return [];
  }
};

// Post a new message
export const sendMessage = async (content: string) => {
  try {
    const url = `${API_BASE_URL}/v1/agents/${AGENT_ID}/messages`;
    const body = {
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: content,
            },
          ],
        },
      ],
    };

    const { data } = await makeProxyRequest(url, "POST", {}, body);

    const messages: any[] = [];
    data.messages.forEach((message: any) => {
      switch (message.message_type) {
        case MESSAGE_TYPE.USER_MESSAGE:
          if (!message.content.includes("heartbeat")) {
            messages.push(message);
          }
          break;
        case MESSAGE_TYPE.ASSISTANT_MESSAGE:
          messages.push(message);
          break;
        default:
          break;
      }
    });
    return messages;
  } catch (error) {
    return handleApiError(error, "Error creating message");
  }
};

// List llm models
export const listLlmModels = async () => {
  try {
    const url = `${API_BASE_URL}/v1/models`;

    const data = await makeProxyRequest(url, "GET");
    return data || [];
  } catch (error) {
    console.error("Error listing runs:", error);
    return [];
  }
};

// Update agent
export const updateAgent = async (settings: unknown) => {
  try {
    const url = `${API_BASE_URL}/v1/agents/${AGENT_ID}`;

    const data = await makeProxyRequest(url, "PATCH", {}, settings);
    return data || [];
  } catch (error) {
    console.error("Error listing runs:", error);
    return [];
  }
};

// Update block
export const updateBlock = async (block: MemoryBlock) => {
  try {
    const url = `${API_BASE_URL}/v1/agents/${AGENT_ID}/core-memory/blocks/${block.label}`;

    const data = await makeProxyRequest(url, "PATCH", {}, block);
    return data || [];
  } catch (error) {
    console.error("Error listing runs:", error);
    return [];
  }
};
