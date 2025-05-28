import React from "react";
import { Home, Brain, Wand2, BarChart } from "lucide-react";

interface TabsComponentProps {
  selectedTab: string;
  setSelectedTab: (tab: string) => void;
  hasCharacter: boolean;
}

const TabsComponent: React.FC<TabsComponentProps> = ({
  selectedTab,
  setSelectedTab,
  hasCharacter,
}) => {
  const tabs = [
    {
      id: "welcome",
      label: "Welcome",
      icon: <Home className="h-4 w-4" />,
    },
    {
      id: "character-generator",
      label: "Character Generator",
      icon: <Wand2 className="h-4 w-4" />,
    },
    {
      id: "agent-simulator",
      label: "Agent Simulator",
      icon: <Brain className="h-4 w-4" />,
      disabled: !hasCharacter,
    },
    {
      id: "dashboard",
      label: "Dashboard",
      icon: <BarChart className="h-4 w-4" />,
    },
  ];

  return (
    <div className="flex justify-center">
      <div className="inline-flex p-1 bg-white/50 backdrop-blur-md rounded-xl shadow-md border border-indigo-100/50">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
              selectedTab === tab.id
                ? "bg-indigo-600 text-white shadow-md"
                : "text-indigo-700 hover:bg-indigo-100"
            } ${tab.disabled ? "opacity-50 cursor-not-allowed" : ""}`}
            onClick={() => !tab.disabled && setSelectedTab(tab.id)}
            disabled={tab.disabled}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default TabsComponent;
