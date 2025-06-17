import React, { useState, useRef, useEffect } from "react";
import {
  Send,
  RefreshCw,
  User,
  Bot,
  Wand2,
  Info,
  Volume2,
  Play,
} from "lucide-react";
import {
  AssistantMessage,
  MESSAGE_TYPE,
  SystemMessage,
  UserMessage,
  Character,
} from "../types";
import {
  sendMessageToGPT4,
  clearConversationHistory,
} from "../services/openaiService";
import {
  sendMessageToClaude,
  clearClaudeConversationHistory,
} from "../services/anthropicService";

interface AgentSimulatorProps {
  selectedModel: string;
  showReasoning: boolean;
  characterId?: string;
  selectedCharacter?: Character;
  onAiResponse?: (response: string) => void;
}

const AgentSimulator: React.FC<AgentSimulatorProps> = ({
  selectedModel,
  showReasoning,
  characterId,
  selectedCharacter,
  onAiResponse,
}) => {
  const [messages, setMessages] = useState<
    (SystemMessage | UserMessage | AssistantMessage)[]
  >([
    {
      id: Date.now().toString(),
      date: new Date(),
      message_type: MESSAGE_TYPE.SYSTEM_MESSAGE,
      content:
        "Hello! I'm your AI assistant focused on competitive intelligence. How can I help you analyze market trends and competitor activities today?",
    },
  ]);
  const [userInput, setUserInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [contextUsage, setContextUsage] = useState(0); // percentage of context window used
  const [thinkingStage, setThinkingStage] = useState<
    "analyzing" | "processing" | "formulating"
  >("analyzing");
  const [reasoningText, setReasoningText] = useState("");
  const [isEnhancingPrompt, setIsEnhancingPrompt] = useState(false);
  const [showEnhanceTooltip, setShowEnhanceTooltip] = useState(false);
  const [showHowItWorks, setShowHowItWorks] = useState(true);
  const [isGeneratingVoice, setIsGeneratingVoice] = useState(false);
  const [currentAudioUrl, setCurrentAudioUrl] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, isThinking]);

  // Show the enhance tooltip briefly when the component mounts
  useEffect(() => {
    setShowEnhanceTooltip(true);
    const timer = setTimeout(() => {
      setShowEnhanceTooltip(false);
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  // Clear conversation when model changes
  useEffect(() => {
    clearConversation();
  }, [selectedModel]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = async () => {
    if (!userInput.trim()) return;

    // Add user message
    const userMessage: UserMessage = {
      id: Date.now().toString(),
      date: new Date(),
      message_type: MESSAGE_TYPE.USER_MESSAGE,
      content: userInput,
    };

    setMessages((prev) => [...prev, userMessage]);
    setUserInput("");
    setShowHowItWorks(false);

    // Start thinking process
    setIsThinking(true);

    try {
      let responseMessages;

      // Check which model is selected and use appropriate API
      if (selectedModel === "gpt-4o") {
        responseMessages = await sendMessageToGPT4(userInput);
      } else if (selectedModel === "claude-sonnet-4") {
        responseMessages = await sendMessageToClaude(
          userInput,
          "claude-sonnet-4-20250514"
        );
      } else {
        throw new Error(`Unsupported model: ${selectedModel}`);
      }

      setIsThinking(false);
      setMessages((previousMessages) => [
        ...previousMessages,
        ...responseMessages,
      ]);

      // Find the assistant message and notify parent component
      const assistantMessage = responseMessages.find(
        (msg) => msg.message_type === MESSAGE_TYPE.ASSISTANT_MESSAGE
      );

      if (assistantMessage) {
        // Notify parent component about the AI response
        if (onAiResponse) {
          onAiResponse(assistantMessage.content);
        }
      }
    } catch (error) {
      console.error("Error sending message:", error);
      setIsThinking(false);

      // Add error message
      const errorMessage: AssistantMessage = {
        id: Date.now().toString(),
        date: new Date(),
        message_type: MESSAGE_TYPE.ASSISTANT_MESSAGE,
        content:
          "I'm sorry, I encountered an error while processing your request. Please try again.",
      };
      setMessages((prev) => [...prev, errorMessage]);
    }
  };

  const enhancePrompt = () => {
    if (!userInput.trim()) return;

    setIsEnhancingPrompt(true);

    // Simulate API call to enhance prompt
    setTimeout(() => {
      const enhancedPrompt = generateEnhancedPrompt(userInput);
      setUserInput(enhancedPrompt);
      setIsEnhancingPrompt(false);
    }, 1500);
  };

  const generateEnhancedPrompt = (input: string): string => {
    // This is a mock prompt enhancer
    const enhancedPrompts: Record<string, string> = {
      "how are our competitors doing":
        "Analyze the recent performance metrics of our top 3 competitors in terms of market share, product innovation, and customer satisfaction. Include any significant strategic shifts or marketing campaigns they've launched in the past quarter.",
      "what's new in the market":
        "Provide a comprehensive analysis of emerging trends, new entrants, and disruptive technologies in our industry over the past 3 months. Highlight potential opportunities or threats these developments pose to our current market position.",
      "competitor analysis":
        "Conduct a detailed SWOT analysis of our main competitors, focusing on their recent product launches, pricing strategies, and customer acquisition tactics. Compare their positioning to ours and identify potential areas where we can gain competitive advantage.",
      "market trends":
        "Analyze the most significant market trends affecting our industry in the past 6 months. Include data on changing customer preferences, regulatory developments, and technological advancements. How might these trends impact our competitive position in the next year?",
      "customer feedback":
        "Synthesize customer feedback about our products compared to our competitors. What are the key differentiators customers value? Where do competitors outperform us? Provide specific examples and quantitative metrics where available.",
    };

    // Check if input contains any of the keys
    for (const key in enhancedPrompts) {
      if (input.toLowerCase().includes(key.toLowerCase())) {
        return enhancedPrompts[key];
      }
    }

    // Default enhancement for inputs that don't match predefined patterns
    return `Provide a detailed competitive intelligence analysis regarding "${input}". Include market positioning, recent strategic moves, and potential implications for our business strategy. Support your analysis with relevant data points and industry benchmarks where applicable.`;
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const clearConversation = () => {
    // Clear conversation history based on selected model
    if (selectedModel === "gpt-4o") {
      clearConversationHistory();
    } else if (selectedModel === "claude-sonnet-4") {
      clearClaudeConversationHistory();
    }

    setMessages([
      {
        id: Date.now().toString(),
        date: new Date(),
        message_type: MESSAGE_TYPE.SYSTEM_MESSAGE,
        content:
          "Hello! I'm your AI assistant focused on competitive intelligence. How can I help you analyze market trends and competitor activities today?",
      },
    ]);
    setContextUsage(25);
    setShowHowItWorks(true);
    setCurrentAudioUrl(null);
  };

  const playLastResponse = () => {
    if (currentAudioUrl && audioRef.current) {
      audioRef.current.play();
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message: any, index: number) => (
          <div
            key={index}
            className={`flex ${
              message.message_type === MESSAGE_TYPE.USER_MESSAGE
                ? "justify-end"
                : "justify-start"
            }`}
          >
            <div
              className={`max-w-[80%] rounded-lg p-3 ${
                message.message_type === MESSAGE_TYPE.USER_MESSAGE
                  ? "bg-indigo-600 text-white"
                  : "bg-gradient-to-br from-white to-indigo-50 border border-indigo-100 shadow-sm text-gray-800"
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                {message.message_type === MESSAGE_TYPE.USER_MESSAGE ? (
                  <>
                    <span className="text-xs font-medium">You</span>
                    <User className="h-3 w-3" />
                  </>
                ) : (
                  <>
                    <span className="text-xs font-medium">AI Assistant</span>
                    <Bot className="h-3 w-3" />
                  </>
                )}
              </div>

              <p className="text-sm whitespace-pre-wrap">{message.content}</p>

              <div className="mt-1 flex items-center justify-between">
                <span
                  className={`text-xs ${
                    message.message_type === MESSAGE_TYPE.USER_MESSAGE
                      ? "text-indigo-200"
                      : "text-gray-500"
                  }`}
                >
                  {new Date(message.date).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>

                {message.message_type === MESSAGE_TYPE.ASSISTANT_MESSAGE &&
                  characterId && (
                    <button
                      className="text-indigo-500 hover:text-indigo-700 p-1 rounded-full"
                      onClick={playLastResponse}
                      title="Play voice response"
                    >
                      <Play className="h-3 w-3" />
                    </button>
                  )}
              </div>
            </div>
          </div>
        ))}

        {isThinking && (
          <div className="flex items-center gap-2 mb-1">
            <div className="flex items-center bg-indigo-100 text-indigo-600 text-xs font-medium px-2 py-1 rounded-full">
              <span className="text-xs font-medium">
                AI Assistant is thinking ...
              </span>
            </div>
          </div>
        )}

        {isGeneratingVoice && (
          <div className="flex items-center gap-2 mb-1">
            <div className="flex items-center bg-indigo-100 text-indigo-600 text-xs font-medium px-2 py-1 rounded-full">
              <Volume2 className="h-3 w-3 mr-1 animate-pulse" />
              <span className="text-xs font-medium">
                Generating voice response...
              </span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center justify-between mb-2">
          <button
            className="text-sm text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
            onClick={clearConversation}
          >
            <RefreshCw className="h-3 w-3" />
            Reset conversation
          </button>
        </div>

        {/* How Agent Simulator Works Explanation */}
        {showHowItWorks && (
          <div className="mb-4 p-4 bg-indigo-50 border border-indigo-100 rounded-lg">
            <div className="flex items-start gap-3">
              <div className="mt-0.5">
                <div className="p-1.5 bg-indigo-100 rounded-lg">
                  <Info className="h-4 w-4 text-indigo-600" />
                </div>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-indigo-700 mb-1">
                  How does the Agent Simulator work?
                </h3>
                <p className="text-xs text-indigo-600 leading-relaxed">
                  ChatAndBuild Agents is an OS-inspired agent management system
                  for virtual context management. It can read and write to
                  external data sources (90M+), modify their own context, and
                  choose when to return responses to your input.
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="mt-3 flex items-end gap-2">
          <div className="flex-1 relative">
            <textarea
              className="w-full p-3 pr-10 border border-gray-300 rounded-lg resize-none text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-800"
              placeholder="Ask about competitive intelligence..."
              rows={2}
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isTyping || isThinking || isEnhancingPrompt}
            />
            <div className="absolute right-3 bottom-3 flex items-center gap-2 text-xs text-gray-400">
              {isEnhancingPrompt ? (
                <div className="flex items-center gap-1 text-indigo-500 animate-pulse">
                  <Wand2 className="h-3 w-3" />
                  <span>Enhancing...</span>
                </div>
              ) : (
                <>{selectedModel}</>
              )}
            </div>
          </div>

          <div className="relative">
            <button
              className={`p-2 rounded-lg transition-colors flex items-center gap-1 ${
                !userInput.trim() || isEnhancingPrompt
                  ? "bg-indigo-200 text-white cursor-not-allowed"
                  : "bg-indigo-100 text-indigo-600 hover:bg-indigo-200 hover:text-indigo-700"
              }`}
              onClick={enhancePrompt}
              disabled={
                !userInput.trim() || isTyping || isThinking || isEnhancingPrompt
              }
              title="Enhance prompt"
              onMouseEnter={() => setShowEnhanceTooltip(true)}
              onMouseLeave={() => setShowEnhanceTooltip(false)}
            >
              <Wand2 className="h-5 w-5" />
              <span className="text-xs font-medium hidden sm:inline">
                Enhance
              </span>
            </button>

            {/* Enhanced tooltip */}
            {showEnhanceTooltip && (
              <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-indigo-800 text-white text-xs rounded py-1 px-2 whitespace-nowrap z-10 shadow-lg">
                <div className="flex items-center gap-1">
                  <Wand2 className="h-3 w-3" />
                  <span>Enhance your prompt with AI</span>
                </div>
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-indigo-800"></div>
              </div>
            )}
          </div>

          <button
            className={`p-3 rounded-lg transition-colors ${
              !userInput.trim() || isTyping || isThinking || isEnhancingPrompt
                ? "bg-indigo-300 text-white cursor-not-allowed"
                : "bg-indigo-600 text-white hover:bg-indigo-700"
            }`}
            onClick={handleSendMessage}
            disabled={
              !userInput.trim() || isTyping || isThinking || isEnhancingPrompt
            }
          >
            <Send className="h-5 w-5" />
          </button>
        </div>

        {/* First-time user hint */}
        {messages.length === 1 && !userInput && !showHowItWorks && (
          <div className="mt-2 text-xs text-center text-indigo-600 bg-indigo-50 p-2 rounded-lg border border-indigo-100 animate-pulse">
            <div className="flex items-center justify-center gap-1">
              <Wand2 className="h-3 w-3" />
              <span>
                Pro tip: Use the <strong>Enhance</strong> button to improve your
                prompts for better results!
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Hidden audio element for voice*/}
      <audio ref={audioRef} className="hidden" />
    </div>
  );
};

export default AgentSimulator;
