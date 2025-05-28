import React, { useState } from 'react';
import { Brain, ArrowRight, Database, Zap, Maximize, ChevronRight } from 'lucide-react';

interface WelcomeLanderProps {
  onGetStarted: () => void;
}

const WelcomeLander: React.FC<WelcomeLanderProps> = ({ onGetStarted }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const totalSteps = 4;

  const nextStep = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onGetStarted();
    }
  };

  const steps = [
    {
      title: "Welcome to ChatAndBuild Agents",
      description: "Build agents at the speed of thought that come with infinite context, powered by intelligence from 90M+ data sources.",
      icon: <Brain className="h-12 w-12 text-white" />,
      image: null,
      buttonText: "Next"
    },
    {
      title: "Iterate at the Speed of Thought",
      description: "Visualize your agent's memory, reasoning steps, and tool calls to understand their decision making, and make edits to their state in real time.",
      icon: <Zap className="h-12 w-12 text-white" />,
      image: null,
      buttonText: "Next"
    },
    {
      title: "No More Context Window Overflow",
      description: "Overstuffed context windows confuse agents and degrade reasoning. ChatAndBuild Agents maximizes agent performance by compiling the most relevant information to pass to the LLM, while keeping token counts under a specified budget.",
      icon: <Maximize className="h-12 w-12 text-white" />,
      image: null,
      buttonText: "Next"
    },
    {
      title: "Powered by 90M+ Data Sources",
      description: "Access comprehensive competitive intelligence with real-time data from millions of sources, giving your agents the knowledge they need to provide accurate, up-to-date insights.",
      icon: <Database className="h-12 w-12 text-white" />,
      image: null,
      buttonText: "Get Started"
    }
  ];

  const currentStepData = steps[currentStep];

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-indigo-900 via-indigo-800 to-purple-900 flex items-center justify-center z-50 overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute w-full h-full opacity-10">
          {Array.from({ length: 50 }).map((_, i) => (
            <div 
              key={i}
              className="absolute rounded-full bg-white"
              style={{
                width: `${Math.random() * 4 + 1}px`,
                height: `${Math.random() * 4 + 1}px`,
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                opacity: Math.random() * 0.5 + 0.3,
                animation: `float ${Math.random() * 10 + 10}s linear infinite`
              }}
            />
          ))}
        </div>
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-indigo-500/20 to-purple-500/20 backdrop-blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-4xl w-full mx-auto px-6">
        {/* Progress indicator */}
        <div className="flex justify-center mb-8">
          {steps.map((_, index) => (
            <div 
              key={index}
              className={`h-1.5 rounded-full mx-1 transition-all duration-300 ${
                index === currentStep 
                  ? "w-8 bg-white" 
                  : index < currentStep 
                    ? "w-4 bg-indigo-300" 
                    : "w-4 bg-indigo-300/30"
              }`}
            />
          ))}
        </div>

        <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 overflow-hidden shadow-2xl transform transition-all duration-500">
          <div className="p-8 md:p-12">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
              {/* Icon section */}
              <div className="flex-shrink-0">
                <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg glow-effect">
                  {currentStepData.icon}
                </div>
              </div>

              {/* Content section */}
              <div className="flex-1">
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-4 tracking-tight">
                  {currentStepData.title}
                </h1>
                <p className="text-lg text-indigo-100 mb-8 leading-relaxed">
                  {currentStepData.description}
                </p>

                {/* Navigation buttons */}
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span className="text-indigo-200 text-sm">
                      Step {currentStep + 1} of {totalSteps}
                    </span>
                  </div>
                  <button
                    onClick={nextStep}
                    className="px-6 py-3 bg-white text-indigo-700 rounded-lg font-medium flex items-center gap-2 hover:bg-indigo-50 transition-colors shadow-md"
                  >
                    {currentStepData.buttonText}
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom feature highlights */}
          {currentStep === 0 && (
            <div className="bg-indigo-800/50 border-t border-white/10 grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-white/10">
              {[
                { icon: <Zap className="h-5 w-5" />, text: "Iterate at the Speed of Thought" },
                { icon: <Maximize className="h-5 w-5" />, text: "No Context Window Overflow" },
                { icon: <Database className="h-5 w-5" />, text: "90M+ Data Sources" }
              ].map((feature, index) => (
                <div key={index} className="p-4 flex items-center gap-3">
                  <div className="p-2 bg-white/10 rounded-lg text-white">
                    {feature.icon}
                  </div>
                  <span className="text-indigo-100 font-medium">{feature.text}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Skip button */}
        <div className="mt-6 text-center">
          <button 
            onClick={onGetStarted} 
            className="text-indigo-200 hover:text-white transition-colors text-sm"
          >
            Skip introduction
          </button>
        </div>
      </div>
    </div>
  );
};

export default WelcomeLander;
