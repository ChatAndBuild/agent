// Message types
export enum MESSAGE_TYPE {
  SYSTEM_MESSAGE = "system_message",
  USER_MESSAGE = "user_message",
  ASSISTANT_MESSAGE = "assistant_message",
  REASONING_MESSAGE = "reasoning_message",
  HIDDEN_REASONING_MESSAGE = "hidden_reasoning_message",
  TOOL_CALL_MESSAGE = "tool_call_message",
  TOOL_RETURN_MESSAGE = "tool_return_message",
}

// Base message interface
interface Message {
  id: string;
  date: Date;
  message_type: MESSAGE_TYPE;
}

// System message
export interface SystemMessage extends Message {
  message_type: MESSAGE_TYPE.SYSTEM_MESSAGE;
  content: string;
}

// User message
export interface UserMessage extends Message {
  message_type: MESSAGE_TYPE.USER_MESSAGE;
  content: string;
}

// Assistant message
export interface AssistantMessage extends Message {
  message_type: MESSAGE_TYPE.ASSISTANT_MESSAGE;
  content: string;
}

// Reasoning message
export interface ReasoningMessage extends Message {
  message_type: MESSAGE_TYPE.REASONING_MESSAGE;
  content: string;
  reasoning: string;
}

// Hidden reasoning message
export interface HiddenReasoningMessage extends Message {
  message_type: MESSAGE_TYPE.HIDDEN_REASONING_MESSAGE;
  content: string;
}

// Tool call message
export interface ToolCallMessage extends Message {
  message_type: MESSAGE_TYPE.TOOL_CALL_MESSAGE;
  content: string;
  tool_name: string;
  tool_input: any;
}

// Tool return message
export interface ToolReturnMessage extends Message {
  message_type: MESSAGE_TYPE.TOOL_RETURN_MESSAGE;
  content: string;
  tool_name: string;
  tool_output: any;
}

// Memory block
export interface MemoryBlock {
  label: string;
  content: string;
}

// LLM Model
export interface LlmModel {
  model: string;
  model_endpoint_type: string;
  context_window: number;
  handle: string;
}

// Character
export interface Character {
  id?: string;
  name: string;
  description: string;
  voice_id: string;
  image_preview: string;
}

// Voice
export interface Voice {
  id: string;
  name: string;
  language: string;
  gender: string;
  preview_url: string;
}

// Animation
export interface Animation {
  id: string;
  character_id: string;
  speech_id: string;
  status: "processing" | "completed" | "failed";
  url?: string;
  created_at: string;
}

// Speech
export interface Speech {
  id: string;
  character_id: string;
  text: string;
  status: "processing" | "completed" | "failed";
  url?: string;
  created_at: string;
}
