import React, { useState, useEffect, useCallback } from "react";
import {
  Database,
  Globe,
  Search,
  Zap,
  HelpCircle,
  BookOpen,
  Brain,
  Layers,
} from "lucide-react";
import ContextWindowBar from "./ContextWindowBar";
import { getContextWindow } from "../services/lettaService";

// Social media and data source icons
const DataSourceIcon: React.FC<{
  name: string;
  icon: string;
  color: string;
}> = ({ name, icon, color }) => {
  return (
    <div className="flex flex-col items-center group">
      <div
        className={`w-7 h-7 flex items-center justify-center rounded-md ${color} text-white shadow-sm group-hover:scale-110 transition-transform`}
        title={name}
      >
        <i className={`fab ${icon} text-xs`}></i>
      </div>
      <span className="text-xs text-gray-500 mt-1 opacity-0 group-hover:opacity-100 transition-opacity absolute top-full font-['Space_Grotesk']">
        {name}
      </span>
    </div>
  );
};

// Pulse animation for active data collection
const PulsingDot: React.FC = () => {
  return (
    <div className="relative">
      <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full animate-ping opacity-75"></div>
      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
    </div>
  );
};

const DataSourcesVisualizer: React.FC = () => {
  const [sourceCount, setSourceCount] = useState(90000000);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showExplainer, setShowExplainer] = useState(false);
  const [contextUsage, setContextUsage] = useState(0); // Percentage of context window used

  const contextWindow = useCallback(async () => {
    const data = await getContextWindow();
    setContextUsage(
      Math.round(
        (data.context_window_size_current / data.context_window_size_max) * 100
      )
    );
  }, []);

  useEffect(() => {
    contextWindow();
  }, [contextWindow]);

  // Simulate increasing source count
  useEffect(() => {
    const interval = setInterval(() => {
      setSourceCount((prev) => prev + Math.floor(Math.random() * 10));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Format the large number with commas
  const formatNumber = (num: number): string => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden font-['Space_Grotesk']">
      <div className="px-3 py-2 border-b border-gray-200 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <div className="p-1 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-md text-white">
            <Database className="h-3.5 w-3.5" />
          </div>
          <h2 className="font-semibold text-gray-800 text-sm">
            Infinite Context Window
          </h2>
          <div
            className="ml-1 p-0.5 bg-indigo-100 rounded-full cursor-pointer hover:bg-indigo-200 transition-colors"
            onClick={() => setShowExplainer(!showExplainer)}
          >
            <HelpCircle className="h-3 w-3 text-indigo-600" />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-indigo-50 px-1.5 py-0.5 rounded-full">
            <PulsingDot />
            <span className="text-xs font-medium text-indigo-700">
              Live Data
            </span>
          </div>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-gray-500 hover:text-gray-700 p-0.5 hover:bg-gray-100 rounded-md transition-colors"
          >
            {isExpanded ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="18 15 12 9 6 15"></polyline>
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Context Window Explainer */}
      {showExplainer && (
        <div className="bg-indigo-50/70 p-3 border-b border-indigo-100">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600 mt-0.5">
              <BookOpen className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-indigo-800 mb-1">
                Infinite Context Window Explained
              </h3>
              <p className="text-xs text-indigo-700 mb-2">
                Your agent has access to virtually unlimited information through
                our intelligent memory management system.
              </p>

              <div className="bg-white rounded-lg p-3 border border-indigo-100 mb-3 shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <div className="p-1.5 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-md text-white">
                    <Layers className="h-4 w-4" />
                  </div>
                  <h4 className="text-xs font-semibold text-gray-800">
                    How It Works
                  </h4>
                </div>

                <div className="flex flex-col md:flex-row gap-4 items-center">
                  {/* Visual representation of the infinite context window */}
                  <div className="relative w-full md:w-1/3 h-32 bg-gradient-to-b from-indigo-100 to-white rounded-lg border border-indigo-200 overflow-hidden">
                    <div className="absolute inset-0 flex flex-col">
                      <div className="h-1/3 bg-indigo-500/10 border-b border-indigo-200 flex items-center justify-center">
                        <span className="text-xs font-medium text-indigo-700">
                          Active Memory
                        </span>
                      </div>
                      <div className="h-2/3 flex items-center justify-center relative">
                        <span className="text-xs font-medium text-indigo-700">
                          Extended Memory
                        </span>
                        <div className="absolute inset-0 flex flex-wrap p-1 opacity-30">
                          {Array.from({ length: 20 }).map((_, i) => (
                            <div key={i} className="w-1/5 h-1/4 p-0.5">
                              <div className="bg-indigo-200 h-full w-full rounded-sm"></div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Animated data flow */}
                      <div className="absolute left-1/2 top-1/3 w-0.5 h-2/3 bg-indigo-300/50">
                        <div className="absolute w-1.5 h-1.5 bg-indigo-500 rounded-full -left-0.5 animate-memory-flow"></div>
                        <div
                          className="absolute w-1.5 h-1.5 bg-indigo-500 rounded-full -left-0.5 animate-memory-flow"
                          style={{ animationDelay: "1.5s" }}
                        ></div>
                      </div>
                    </div>
                  </div>

                  <div className="w-full md:w-2/3">
                    <p className="text-xs text-gray-600 mb-2">
                      Think of your agent as having both short-term and
                      long-term memory:
                    </p>
                    <ul className="text-xs text-gray-600 space-y-1 list-disc pl-4">
                      <li>
                        <span className="font-medium text-indigo-700">
                          Active Memory
                        </span>
                        : What your agent is currently focusing on
                      </li>
                      <li>
                        <span className="font-medium text-indigo-700">
                          Extended Memory
                        </span>
                        : A vast repository of information that can be recalled
                        when needed
                      </li>
                      <li>
                        Our system intelligently manages these memory layers,
                        giving your agent access to virtually unlimited context
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="text-xs text-indigo-600 italic">
                Pro Tip: The more intelligence sources your agent has access to,
                the more comprehensive its responses will be.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Pro Tip Banner (shows only when not expanded and explainer is not shown) */}
      {!isExpanded && !showExplainer && (
        <div className="px-3 py-2 bg-gradient-to-r from-indigo-50 to-blue-50 border-b border-indigo-100 flex items-center gap-2">
          <div className="p-1 bg-indigo-100 rounded-full text-indigo-600">
            <Zap className="h-3.5 w-3.5" />
          </div>
          <div className="flex-1">
            <p className="text-xs text-indigo-700">
              <span className="font-semibold">Pro Tip:</span> Your agent has
              access to {formatNumber(sourceCount)}+ intelligence sources
              through our infinite context window technology.
            </p>
          </div>
          <button
            onClick={() => setShowExplainer(true)}
            className="text-xs text-indigo-600 font-medium hover:text-indigo-800 transition-colors whitespace-nowrap"
          >
            Learn More
          </button>
        </div>
      )}

      {/* Context Window Usage Meter */}
      <div className="px-3 py-2 border-b border-gray-100">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-1.5">
            <Brain className="h-3.5 w-3.5 text-indigo-500" />
            <span className="text-xs font-medium text-gray-700">
              Context Window Usage
            </span>
          </div>
          <span className="text-xs text-indigo-600 font-medium">
            {contextUsage}%
          </span>
        </div>
        <ContextWindowBar usagePercentage={contextUsage} className="mb-1" />
        <p className="text-xs text-gray-500">
          Your agent is efficiently managing its memory resources
        </p>
      </div>

      <div
        className={`transition-all duration-300 ease-in-out ${
          isExpanded ? "max-h-80" : "max-h-0"
        } overflow-hidden`}
      >
        <div className="px-3 py-2">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5">
              <Search className="h-3.5 w-3.5 text-indigo-500" />
              <span className="text-xs font-medium text-gray-700">
                Intelligence Sources
              </span>
              <span className="text-xs bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded-full font-medium">
                {formatNumber(sourceCount)}+ sources
              </span>
            </div>
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <Globe className="h-3 w-3" />
              <span>Global Coverage</span>
            </div>
          </div>

          {/* Main sources visualization */}
          <div className="mb-2">
            <h3 className="text-xs font-medium text-gray-500 mb-1.5">
              MAJOR PLATFORMS
            </h3>
            <div className="grid grid-cols-8 gap-2">
              {/* We're using Font Awesome icons via classes */}
              <DataSourceIcon
                name="Twitter/X"
                icon="fa-twitter"
                color="bg-black"
              />
              <DataSourceIcon
                name="Reddit"
                icon="fa-reddit"
                color="bg-orange-600"
              />
              <DataSourceIcon
                name="Instagram"
                icon="fa-instagram"
                color="bg-pink-600"
              />
              <DataSourceIcon name="TikTok" icon="fa-tiktok" color="bg-black" />
              <DataSourceIcon
                name="YouTube"
                icon="fa-youtube"
                color="bg-red-600"
              />
              <DataSourceIcon
                name="Facebook"
                icon="fa-facebook"
                color="bg-blue-600"
              />
              <DataSourceIcon
                name="LinkedIn"
                icon="fa-linkedin"
                color="bg-blue-700"
              />
              <DataSourceIcon
                name="News"
                icon="fa-newspaper"
                color="bg-gray-700"
              />
            </div>
          </div>

          <div className="mb-2">
            <h3 className="text-xs font-medium text-gray-500 mb-1.5">
              ADDITIONAL SOURCES
            </h3>
            <div className="grid grid-cols-4 gap-1.5">
              <div className="bg-gray-50 rounded-md p-1.5 text-xs text-gray-700 flex items-center gap-1">
                <i className="fas fa-comment text-gray-500 text-xs"></i>
                <span>Forums</span>
                <span className="ml-auto text-gray-500">12.3M+</span>
              </div>
              <div className="bg-gray-50 rounded-md p-1.5 text-xs text-gray-700 flex items-center gap-1">
                <i className="fas fa-rss text-gray-500 text-xs"></i>
                <span>Blogs</span>
                <span className="ml-auto text-gray-500">8.7M+</span>
              </div>
              <div className="bg-gray-50 rounded-md p-1.5 text-xs text-gray-700 flex items-center gap-1">
                <i className="fas fa-newspaper text-gray-500 text-xs"></i>
                <span>News Sites</span>
                <span className="ml-auto text-gray-500">42K+</span>
              </div>
              <div className="bg-gray-50 rounded-md p-1.5 text-xs text-gray-700 flex items-center gap-1">
                <i className="fas fa-podcast text-gray-500 text-xs"></i>
                <span>Podcasts</span>
                <span className="ml-auto text-gray-500">156K+</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-xs font-medium text-gray-500 mb-1.5">
              DATA PROCESSING
            </h3>
            <div className="bg-indigo-50 rounded-md p-2">
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-1">
                  <Zap className="h-3 w-3 text-indigo-600" />
                  <span className="text-xs font-medium text-indigo-700">
                    Real-time Analysis
                  </span>
                </div>
                <span className="text-xs text-indigo-600 font-medium">
                  ~500K posts/minute
                </span>
              </div>
              <div className="h-1.5 bg-indigo-100 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-indigo-500 to-blue-500 w-3/4 rounded-full animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 px-3 py-1.5 border-t border-gray-200 flex justify-between items-center">
        <span className="text-xs text-gray-500">Updated in real-time</span>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-xs text-indigo-600 hover:text-indigo-800 font-medium"
        >
          {isExpanded ? "Hide Details" : "View Intelligence Sources"}
        </button>
      </div>
    </div>
  );
};

export default DataSourcesVisualizer;
