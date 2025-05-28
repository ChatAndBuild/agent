import { AssistantMessage, UserMessage, MESSAGE_TYPE } from "../types";

const BACKEND_URL = import.meta.env.VITE_BACKEND_API_URL;

interface AnthropicMessage {
  role: "user" | "assistant";
  content: string;
}

interface BackendResponse {
  success: boolean;
  data?: {
    id: string;
    type: string;
    role: string;
    content: Array<{
      type: string;
      text: string;
    }>;
    model: string;
    stop_reason: string;
    stop_sequence: string | null;
    usage: {
      input_tokens: number;
      output_tokens: number;
    };
  };
  error?: string;
}

// Store conversation history
let conversationHistory: AnthropicMessage[] = [];

export const sendMessageToClaude = async (
  userMessage: string,
  model: string = "claude-sonnet-4-20250514"
): Promise<(UserMessage | AssistantMessage)[]> => {
  try {
    // Add user message to history
    conversationHistory.push({
      role: "user",
      content: userMessage,
    });

    const response = await fetch(`${BACKEND_URL}/api/anthropic/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: model,
        messages: conversationHistory,
        max_tokens: 1000,
        temperature: 0.7,
        system:
          "You are a helpful AI assistant focused on competitive intelligence. You help analyze market trends, competitor activities, and provide strategic insights.",
      }),
    });

    if (!response.ok) {
      throw new Error(`Backend API error: ${response.statusText}`);
    }

    const result: BackendResponse = await response.json();

    if (!result.success || !result.data) {
      throw new Error(result.error || "Failed to get response from backend");
    }

    if (result.data.content && result.data.content.length > 0) {
      const assistantMessage = result.data.content[0].text;

      // Add assistant message to history
      conversationHistory.push({
        role: "assistant",
        content: assistantMessage,
      });

      // Return formatted messages for the UI
      const messages: AssistantMessage[] = [
        {
          id: Date.now().toString(),
          date: new Date(),
          message_type: MESSAGE_TYPE.ASSISTANT_MESSAGE,
          content: assistantMessage,
        },
      ];

      return messages;
    }

    throw new Error("No response from Claude");
  } catch (error) {
    console.error("Error calling Anthropic API:", error);

    // Return error message
    return [
      {
        id: Date.now().toString(),
        date: new Date(),
        message_type: MESSAGE_TYPE.ASSISTANT_MESSAGE,
        content: `Error: ${
          error instanceof Error
            ? error.message
            : "Failed to get response from Claude"
        }`,
      },
    ];
  }
};

export const clearClaudeConversationHistory = () => {
  conversationHistory = [];
};

export const getClaudeConversationHistory = () => {
  return conversationHistory;
};
