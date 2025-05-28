import React, { useState } from "react";
import { BarChart, Brain, Video } from "lucide-react";
import VideoPreview from "./VideoPreview";
import AgentSimulator from "./AgentSimulator";
import { Character, LlmModel } from "../types";

interface AgentSimulatorTabProps {
  llmModels: LlmModel[];
  selectedModel: string;
  showReasoning: boolean;
  setSelectedModel: (model: string) => void;
  selectedCharacter?: Character;
}

const AgentSimulatorTab: React.FC<AgentSimulatorTabProps> = ({
  llmModels,
  selectedModel,
  showReasoning,
  setSelectedModel,
  selectedCharacter,
}) => {
  const [aiResponse, setAiResponse] = useState<string>("");

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-full">
      {/* Left Panel - Video Preview */}
      <div className="w-full lg:w-2/5 bg-white/70 backdrop-blur-md rounded-xl overflow-hidden border border-indigo-100/50 shadow-xl transition-all duration-300 hover:shadow-indigo-100/30 hover:translate-y-[-2px] flex flex-col">
        <div className="p-4 border-b border-indigo-100/50 bg-gradient-to-r from-indigo-50/80 to-purple-50/80 backdrop-blur-sm flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-lg text-white shadow-md">
              <Video className="h-4 w-4" />
            </div>
            <h2 className="font-semibold text-indigo-900 tracking-tight">
              Video Response
            </h2>
          </div>
        </div>
        <div className="bg-white/90 backdrop-blur-sm flex-1 min-h-[500px]">
          <VideoPreview
            aiResponse={aiResponse}
            selectedCharacter={selectedCharacter}
          />
        </div>
      </div>

      {/* Right Panel - Agent Simulator */}
      <div className="w-full lg:w-3/5 bg-white/70 backdrop-blur-md rounded-xl overflow-hidden border border-indigo-100/50 shadow-xl transition-all duration-300 hover:shadow-indigo-100/30 hover:translate-y-[-2px] flex flex-col">
        <div className="p-4 border-b border-indigo-100/50 bg-gradient-to-r from-indigo-50/80 to-purple-50/80 backdrop-blur-sm flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-lg text-white shadow-md">
              <Brain className="h-4 w-4" />
            </div>
            <h2 className="font-semibold text-indigo-900 tracking-tight">
              Agent Simulator
            </h2>
            {selectedCharacter && (
              <span className="ml-2 text-xs bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full">
                {selectedCharacter.name}
              </span>
            )}
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="text-sm text-indigo-700">Model:</span>
              <select
                className="text-sm border border-indigo-200 rounded-md px-2 py-1 bg-white/80 backdrop-blur-sm text-indigo-700 shadow-sm focus:ring-2 focus:ring-indigo-300 focus:border-indigo-300 focus:outline-none"
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
              >
                {llmModels &&
                  llmModels.map((model) => (
                    <option key={model.model} value={model.model}>
                      {model.model}
                    </option>
                  ))}
              </select>
            </div>
          </div>
        </div>

        <div className="flex-1 flex flex-col bg-white/90 backdrop-blur-sm">
          <AgentSimulator
            selectedModel={selectedModel}
            showReasoning={showReasoning}
            characterId={selectedCharacter?.id}
            selectedCharacter={selectedCharacter}
            onAiResponse={(response) => setAiResponse(response)}
          />
        </div>
      </div>
    </div>
  );
};

export default AgentSimulatorTab;
