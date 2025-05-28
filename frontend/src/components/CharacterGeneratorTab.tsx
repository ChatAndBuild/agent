import React from "react";
import { Wand2 } from "lucide-react";
import CharacterGenerator from "./CharacterGenerator";
import { Character } from "../types";

interface CharacterGeneratorTabProps {
  onCharacterCreated: (character: Character) => void;
}

const CharacterGeneratorTab: React.FC<CharacterGeneratorTabProps> = ({
  onCharacterCreated,
}) => {
  return (
    <div className="flex flex-col lg:flex-row gap-6">
      {/* Character Generator Panel */}
      <div className="w-full bg-white/70 backdrop-blur-md rounded-xl overflow-hidden border border-indigo-100/50 shadow-xl transition-all duration-300 hover:shadow-indigo-100/30 hover:translate-y-[-2px] flex flex-col">
        <div className="p-4 border-b border-indigo-100/50 bg-gradient-to-r from-indigo-50/80 to-purple-50/80 backdrop-blur-sm flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-lg text-white shadow-md">
              <Wand2 className="h-4 w-4" />
            </div>
            <h2 className="font-semibold text-indigo-900 tracking-tight">
              Character Generator
            </h2>
          </div>
        </div>

        <div className="flex-1 flex flex-col bg-white/90 backdrop-blur-sm">
          <CharacterGenerator onCharacterCreated={onCharacterCreated} />
        </div>
      </div>
    </div>
  );
};

export default CharacterGeneratorTab;
