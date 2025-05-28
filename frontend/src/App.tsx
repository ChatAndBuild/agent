import { useState } from "react";
import { LlmModel, Character, MemoryBlock } from "./types";
import Header from "./components/Header";
import TabsComponent from "./components/TabsComponent";
import WelcomeLander from "./components/WelcomeLander";
import AgentSimulatorTab from "./components/AgentSimulatorTab";
import CharacterGeneratorTab from "./components/CharacterGeneratorTab";
import DashboardTab from "./components/DashboardTab";
import AgentSettingsComponent from "./components/AgentSettingsComponent";

function App() {
  // State for selected tab
  const [selectedTab, setSelectedTab] = useState<string>("character-generator");

  // State for LLM models
  const [llmModels, setLlmModels] = useState<LlmModel[]>([
    {
      model: "gpt-4o",
      model_endpoint_type: "openai",
      context_window: 128000,
      handle: "gpt-4o",
    },
    {
      model: "claude-sonnet-4",
      model_endpoint_type: "anthropic",
      context_window: 200000,
      handle: "claude-sonnet-4-20250514",
    },
  ]);

  // State for selected model
  const [selectedModel, setSelectedModel] = useState<string>("gpt-4o");

  // State for showing reasoning
  const [showReasoning, setShowReasoning] = useState<boolean>(false);

  // State for selected character
  const [selectedCharacter, setSelectedCharacter] = useState<
    Character | undefined
  >(undefined);

  // State for showing agent settings
  const [showAgentSettings, setShowAgentSettings] = useState<boolean>(false);

  // Handle character creation
  const handleCharacterCreated = (character: Character) => {
    setSelectedCharacter(character);
    setSelectedTab("agent-simulator");
  };

  // Handle welcome lander get started
  const handleGetStarted = () => {
    setSelectedTab("character-generator");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 flex flex-col">
      <Header
        showAgentSettings={showAgentSettings}
        setShowAgentSettings={setShowAgentSettings}
        showReasoning={showReasoning}
        setShowReasoning={setShowReasoning}
      />

      <main className="flex-1 container mx-auto px-4 py-6 flex flex-col">
        <TabsComponent
          selectedTab={selectedTab}
          setSelectedTab={setSelectedTab}
          hasCharacter={!!selectedCharacter}
        />

        <div className="mt-6 flex-1 flex flex-col">
          {selectedTab === "welcome" && (
            <WelcomeLander onGetStarted={handleGetStarted} />
          )}

          {selectedTab === "character-generator" && (
            <CharacterGeneratorTab
              onCharacterCreated={handleCharacterCreated}
            />
          )}

          {selectedTab === "agent-simulator" && (
            <AgentSimulatorTab
              llmModels={llmModels}
              selectedModel={selectedModel}
              showReasoning={showReasoning}
              setSelectedModel={setSelectedModel}
              selectedCharacter={selectedCharacter}
            />
          )}

          {selectedTab === "dashboard" && <DashboardTab />}
        </div>
      </main>

      {showAgentSettings && (
        <AgentSettingsComponent onClose={() => setShowAgentSettings(false)} />
      )}
    </div>
  );
}

export default App;
