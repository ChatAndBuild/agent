import React from 'react';
import { X, Brain, Lightbulb, Info } from 'lucide-react';

interface AgentSettingsPopupProps {
  isOpen: boolean;
  onClose: () => void;
  agentMemory: string;
  setAgentMemory: (memory: string) => void;
  agentPersona: string;
  setAgentPersona: (persona: string) => void;
  showReasoning: boolean;
  setShowReasoning: (show: boolean) => void;
}

const MAX_CHARS = 5000;

const AgentSettingsPopup: React.FC<AgentSettingsPopupProps> = ({
  isOpen,
  onClose,
  agentMemory,
  setAgentMemory,
  agentPersona,
  setAgentPersona,
  showReasoning,
  setShowReasoning
}) => {
  if (!isOpen) return null;

  const memoryCharsUsed = agentMemory.length;
  const personaCharsUsed = agentPersona.length;
  
  const getCharCountColor = (count: number) => {
    if (count > MAX_CHARS) return 'text-red-600';
    if (count > MAX_CHARS * 0.9) return 'text-amber-600';
    return 'text-gray-500';
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-auto">
        <div className="p-4 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white z-10">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-lg text-white">
              <Brain className="h-4 w-4" />
            </div>
            <h2 className="font-semibold text-gray-800">Agent Settings</h2>
          </div>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <div className="p-6 space-y-6">
          {/* Pro Tip */}
          <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-4">
            <div className="flex gap-3">
              <div className="mt-1">
                <Lightbulb className="h-5 w-5 text-amber-500" />
              </div>
              <div>
                <h3 className="font-medium text-indigo-800 mb-1">Pro Tip</h3>
                <p className="text-sm text-indigo-700">
                  ChatAndBuild agents have persistent states and core memories that are updated in real time. 
                  Enter the core memory to get started.
                </p>
              </div>
            </div>
          </div>
          
          {/* Agent Memory */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700">Agent Memory</label>
              <span className={`text-xs ${getCharCountColor(memoryCharsUsed)}`}>
                {memoryCharsUsed}/{MAX_CHARS} characters
              </span>
            </div>
            <textarea
              className={`w-full p-3 border ${memoryCharsUsed > MAX_CHARS ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-indigo-500'} rounded-md text-sm focus:ring-2 focus:border-transparent transition-colors`}
              rows={5}
              value={agentMemory}
              onChange={(e) => setAgentMemory(e.target.value)}
              placeholder="Define what the agent should remember..."
            />
            {memoryCharsUsed > MAX_CHARS && (
              <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                <Info className="h-3 w-3" />
                Character limit exceeded. Please reduce your text.
              </p>
            )}
          </div>
          
          {/* Agent Persona */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700">Agent Persona</label>
              <span className={`text-xs ${getCharCountColor(personaCharsUsed)}`}>
                {personaCharsUsed}/{MAX_CHARS} characters
              </span>
            </div>
            <textarea
              className={`w-full p-3 border ${personaCharsUsed > MAX_CHARS ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-indigo-500'} rounded-md text-sm focus:ring-2 focus:border-transparent transition-colors`}
              rows={5}
              value={agentPersona}
              onChange={(e) => setAgentPersona(e.target.value)}
              placeholder="Define the agent's personality..."
            />
            {personaCharsUsed > MAX_CHARS && (
              <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                <Info className="h-3 w-3" />
                Character limit exceeded. Please reduce your text.
              </p>
            )}
          </div>
          
          {/* Show Reasoning */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="show-reasoning"
              checked={showReasoning}
              onChange={() => setShowReasoning(!showReasoning)}
              className="rounded text-indigo-600"
            />
            <label htmlFor="show-reasoning" className="text-sm text-gray-700">Show agent reasoning</label>
          </div>
        </div>
        
        <div className="p-4 border-t border-gray-200 bg-gray-50 flex justify-end">
          <button 
            onClick={onClose}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
          >
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
};

export default AgentSettingsPopup;
