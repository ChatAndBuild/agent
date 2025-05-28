import React from "react";
import { Brain, Settings, Database } from "lucide-react";
import DataSourcesVisualizer from "./DataSourcesVisualizer";
import AgentSettingsComponent from "./AgentSettingsComponent";
import { MemoryBlock } from "../types";

interface DashboardTabProps {
  agentMemory: MemoryBlock[];
  setAgentMemory: (memory: MemoryBlock[]) => void;
  onNavigateToSimulator: () => void;
}

const DashboardTab: React.FC<DashboardTabProps> = ({
  agentMemory,
  setAgentMemory,
  onNavigateToSimulator,
}) => {
  return (
    <div className="flex flex-col gap-6">
      {/* Data Sources Visualizer */}
      <div className="w-full bg-white/70 backdrop-blur-md rounded-xl overflow-hidden border border-indigo-100/50 shadow-xl transition-all duration-300 hover:shadow-indigo-100/30 hover:translate-y-[-2px]">
        <DataSourcesVisualizer />
      </div>

      {/* Agent Settings Component */}
      <div className="w-full bg-white/70 backdrop-blur-md rounded-xl overflow-hidden border border-indigo-100/50 shadow-xl transition-all duration-300 hover:shadow-indigo-100/30 hover:translate-y-[-2px]">
        <div className="p-4 border-b border-indigo-100/50 bg-gradient-to-r from-indigo-50/80 to-purple-50/80 backdrop-blur-sm flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-lg text-white shadow-md">
              <Settings className="h-4 w-4" />
            </div>
            <h2 className="font-semibold text-indigo-900 tracking-tight">
              Agent Settings
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-indigo-600 bg-indigo-100/50 px-2 py-0.5 rounded-full">
              Customize your agent
            </span>
          </div>
        </div>
        <AgentSettingsComponent
          agentMemory={agentMemory}
          setAgentMemory={setAgentMemory}
        />
      </div>

      {/* Navigation Button to Agent Simulator */}
      <div className="w-full bg-white/70 backdrop-blur-md rounded-xl overflow-hidden border border-indigo-100/50 shadow-xl transition-all duration-300 hover:shadow-indigo-100/30 hover:translate-y-[-2px]">
        <div className="p-6 flex flex-col items-center text-center">
          <div className="p-3 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-lg text-white shadow-md mb-4">
            <Brain className="h-6 w-6" />
          </div>
          <h2 className="text-xl font-semibold text-indigo-900 tracking-tight mb-2">
            Ready to interact with your agent?
          </h2>
          <p className="text-indigo-600 mb-4 max-w-md">
            Test your agent's capabilities with real-time competitive
            intelligence and see how it responds to your queries.
          </p>
          <button
            onClick={onNavigateToSimulator}
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium flex items-center gap-2 hover:bg-indigo-700 transition-colors shadow-md"
          >
            Launch Agent Simulator
            <Brain className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardTab;
