import React, { useEffect, useState } from "react";
import {
  Info,
  ChevronDown,
  ChevronUp,
  Zap,
  Brain,
  Maximize,
  Sparkles,
} from "lucide-react";
import ContextWindowBar from "./ContextWindowBar";
import { MemoryBlock } from "../types";

interface AgentSettingsComponentProps {
  agentMemory: MemoryBlock[];
  setAgentMemory: (memory: MemoryBlock[]) => void;
}

const AgentSettingsComponent: React.FC<AgentSettingsComponentProps> = ({
  agentMemory,
  setAgentMemory,
}) => {
  const [isMemoryExpanded, setIsMemoryExpanded] = useState(false);
  const [isEnhancingMemory, setIsEnhancingMemory] = useState(false);

  // Enhance agent memory with AI suggestions
  const enhanceAgentMemory = () => {};

  const handleMemoryUpdate = (id: string, value: string) => {
    const memories = agentMemory.map((memory) =>
      memory.id == id ? { ...memory, value } : memory
    );
    setAgentMemory(memories);
  };

  return (
    <div className="bg-white/90 backdrop-blur-sm p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Agent Memory Section */}
        {agentMemory &&
          agentMemory.length > 0 &&
          agentMemory.map((memory) => (
            <div className="space-y-3" key={memory.id}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-lg text-white shadow-md">
                    <Brain className="h-4 w-4" />
                  </div>
                  <h3 className="font-semibold text-indigo-900">
                    Agent {memory.label}
                  </h3>
                  <button className="text-indigo-500 hover:text-indigo-700 transition-colors">
                    <Info className="h-4 w-4" />
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-indigo-700 bg-indigo-100/50 px-2 py-0.5 rounded-full">
                    {memory.value.length}/{memory.limit} chars
                  </span>
                  <button
                    onClick={() => setIsMemoryExpanded(!isMemoryExpanded)}
                    className="text-indigo-500 hover:text-indigo-700 transition-colors p-1 hover:bg-indigo-100/50 rounded-md"
                  >
                    {isMemoryExpanded ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              <div
                className={`transition-all duration-300 ${
                  isMemoryExpanded ? "max-h-96" : "max-h-32"
                } overflow-hidden`}
              >
                <textarea
                  value={memory.value}
                  onChange={(e) =>
                    handleMemoryUpdate(memory.id, e.target.value)
                  }
                  className="w-full h-full min-h-[8rem] p-3 border border-indigo-200 rounded-lg focus:ring-2 focus:ring-indigo-300 focus:border-indigo-300 focus:outline-none bg-white/80 backdrop-blur-sm text-indigo-900 resize-none"
                  placeholder="Enter agent memory..."
                  maxLength={memory.limit}
                />
              </div>

              <div className="flex items-center justify-between">
                <ContextWindowBar
                  usagePercentage={Math.min(
                    100,
                    Math.round((memory.value.length / memory.limit) * 100)
                  )}
                  className="flex-1 mr-2"
                />

                <button
                  onClick={enhanceAgentMemory}
                  disabled={isEnhancingMemory}
                  className={`px-3 py-1.5 flex items-center gap-1.5 rounded-lg text-sm font-medium shadow-sm transition-all ${
                    isEnhancingMemory
                      ? "bg-indigo-100 text-indigo-400 cursor-not-allowed"
                      : "bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700"
                  }`}
                >
                  {isEnhancingMemory ? (
                    <>
                      <div className="animate-spin h-4 w-4 border-2 border-indigo-400 border-t-transparent rounded-full"></div>
                      <span>Enhancing...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4" />
                      <span>Enhance</span>
                    </>
                  )}
                </button>
              </div>

              {/* <div className="bg-indigo-50/50 border border-indigo-100 rounded-lg p-3 flex items-start gap-2">
            <div className="p-1 bg-indigo-100 rounded-md text-indigo-600 mt-0.5">
              <Zap className="h-4 w-4" />
            </div>
            <div>
              <p className="text-xs text-indigo-700 font-medium">Pro tip</p>
              <p className="text-xs text-indigo-600">
                Agent human defines what your agent knows about itself and its
                capabilities. Be specific about its expertise and limitations.
              </p>
            </div>
          </div> */}
            </div>
          ))}
      </div>

      {/* Total Context Window Usage */}
      {/* <div className="mt-6 p-4 bg-gradient-to-r from-indigo-50/80 to-purple-50/80 rounded-lg border border-indigo-100/50">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg text-white shadow-md">
              <Maximize className="h-4 w-4" />
            </div>
            <h3 className="font-semibold text-indigo-900">
              Total Context Window Usage
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <div
              className={`h-2 w-2 rounded-full ${
                totalUsage < 50
                  ? "bg-green-500"
                  : totalUsage < 80
                  ? "bg-yellow-500"
                  : "bg-red-500"
              } ${totalUsage >= 80 ? "animate-pulse" : ""}`}
            ></div>
            <span className="text-sm font-medium text-indigo-900">
              {totalUsage}%
            </span>
          </div>
        </div>

        <ContextWindowBar usagePercentage={totalUsage} />

        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="show-reasoning"
              checked={showReasoning}
              onChange={(e) => setShowReasoning(e.target.checked)}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <label
              htmlFor="show-reasoning"
              className="text-sm text-indigo-900 font-medium"
            >
              Show agent reasoning steps
            </label>
          </div>

          <button className="px-3 py-1.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm font-medium rounded-lg shadow-md hover:from-indigo-700 hover:to-purple-700 transition-colors">
            Optimize Context
          </button>
        </div>
      </div> */}
    </div>
  );
};

export default AgentSettingsComponent;
