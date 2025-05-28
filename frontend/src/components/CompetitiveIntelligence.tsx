import React, { useState, useEffect } from "react";
import {
  BarChart2,
  TrendingUp,
  Newspaper,
  AlertCircle,
  Filter,
  RefreshCw,
  Zap,
  Clock,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { MentionData, NewsArticle, TopMention } from "../types";
import {
  getHighImpact,
  getMentionsOverview,
  getSentiment,
  getTopAuthors,
  getTopSites,
  getTotalMentions,
} from "../services/brandwatchService";

// Mock data
const mentionsOverTime: MentionData[] = [
  { date: "Jan", count: 120 },
  { date: "Feb", count: 150 },
  { date: "Mar", count: 180 },
  { date: "Apr", count: 210 },
  { date: "May", count: 250 },
  { date: "Jun", count: 190 },
  { date: "Jul", count: 220 },
];

const topNewsArticles: NewsArticle[] = [
  {
    id: "1",
    title: "Competitor X Launches New AI Platform",
    source: "TechCrunch",
    url: "#",
    date: "2 hours ago",
    impact: 85,
  },
  {
    id: "2",
    title: "Market Analysis Shows Shift in Consumer Behavior",
    source: "Forbes",
    url: "#",
    date: "5 hours ago",
    impact: 72,
  },
  {
    id: "3",
    title: "Industry Leaders Announce Strategic Partnership",
    source: "Business Insider",
    url: "#",
    date: "1 day ago",
    impact: 68,
  },
];

const topMentions: TopMention[] = [
  {
    id: "1",
    content:
      "The new product launch by Competitor Y is gaining significant traction in the market.",
    source: "Twitter",
    impact: 92,
    sentiment: "negative",
  },
  {
    id: "2",
    content:
      "Our latest feature received positive feedback from industry analysts.",
    source: "LinkedIn",
    impact: 78,
    sentiment: "positive",
  },
  {
    id: "3",
    content:
      "Market research indicates a growing demand for AI-powered solutions in our sector.",
    source: "Industry Report",
    impact: 85,
    sentiment: "neutral",
  },
];

const CompetitiveIntelligence: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"overview" | "sites" | "authors">(
    "overview"
  );
  const [isStreaming, setIsStreaming] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  const [mentionsOverTime, setMentionsOverTime] = useState([]);
  const [mentionsCount, setMentionsCount] = useState(0);
  const [growth, setGrowth] = useState(0);
  const [positives, setPositives] = useState(0);
  const [highImpact, setHighImpact] = useState(0);

  const [topSites, setTopSites] = useState<any[]>([]);
  const [topAuthors, setTopAuthors] = useState<any[]>([]);

  // Format the last updated time
  const formatLastUpdated = (date: Date): string => {
    return new Intl.DateTimeFormat("en-US", {
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
      hour12: true,
    }).format(date);
  };

  // Handle refresh
  const handleRefresh = () => {
    // Simulate refresh with animation
    setIsStreaming(true);
    setTimeout(() => {
      setLastUpdated(new Date());
      // In a real app, you would fetch new data here
    }, 1500);
  };

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    const indexedDate = localStorage.getItem("indexedDate");
    if (today == indexedDate) {
      setGrowth(Number(localStorage.getItem("growth") || 0));
      setMentionsOverTime(
        JSON.parse(localStorage.getItem("mentionsOverTime") || "[]")
      );
      setMentionsCount(Number(localStorage.getItem("totalMentions") || 0));
      setPositives(Number(localStorage.getItem("sentiment") || 0));
      setHighImpact(Number(localStorage.getItem("highImpact") || 0));
      setTopSites(JSON.parse(localStorage.getItem("topSites") || "[]"));
      setTopAuthors(JSON.parse(localStorage.getItem("topAuthors") || "[]"));
    } else {
      localStorage.setItem("indexedDate", today);
      getMentionsOverview().then((data) => {
        const growthData = Math.round(
          (data.results[0].values[0].value /
            data.results[0].values[data.results[0].values.length - 1].value) *
            100
        );
        localStorage.setItem("growth", growthData.toString());
        setGrowth(growthData);
        const mentionsOverTimeData = data.results[0].values.map((item) => ({
          date: new Date(item.id).toLocaleDateString(),
          count: item.value,
        }));
        localStorage.setItem(
          "mentionsOverTime",
          JSON.stringify(mentionsOverTimeData)
        );
        setMentionsOverTime(mentionsOverTimeData);
      });

      getTotalMentions().then((data) => {
        const totalMentionsData = data.mentionsCount;
        localStorage.setItem("totalMentions", totalMentionsData.toString());
        setMentionsCount(data.mentionsCount);
      });

      getSentiment().then((data) => {
        const sentimentData = Math.round(
          (data.results[0].values[0].value /
            (data.results[0].values[0].value +
              data.results[1].values[0].value +
              data.results[2].values[0].value)) *
            100
        );
        localStorage.setItem("sentiment", sentimentData.toString());
        setPositives(sentimentData);
      });

      getHighImpact().then((data) => {
        let highImpactData = 0;
        data.results[0].values.forEach(
          (item) => (highImpactData += item.value)
        );
        localStorage.setItem("highImpact", highImpactData.toString());
        setHighImpact(highImpactData);
      });

      getTopSites().then((data) => {
        const topSitesData = data.results.slice(0, 5);
        localStorage.setItem("topSites", JSON.stringify(topSitesData));
        setTopSites(topSitesData);
      });

      getTopAuthors().then((data) => {
        const topAuthorsData = data.results.slice(0, 3);
        localStorage.setItem("topAuthors", JSON.stringify(topAuthorsData));
        setTopAuthors(topAuthorsData);
      });
    }
  }, []);

  const sentimentSpan = (sentiment: any) => {
    let top = "";
    if (sentiment.negative > sentiment.positive) {
      if (sentiment.negative > sentiment.neutral) {
        top = "Negative";
      } else {
        top = "Neutral";
      }
    } else {
      if (sentiment.positive > sentiment.neutral) {
        top = "Positive";
      } else {
        top = "Neutral";
      }
    }
    return (
      <span
        className={`text-xs px-2 py-0.5 rounded-full ${
          top === "Positive"
            ? "bg-green-100 text-green-700"
            : top === "Negative"
            ? "bg-red-100 text-red-700"
            : "bg-gray-100 text-gray-700"
        }`}
      >
        {top}
      </span>
    );
  };

  return (
    <div className="space-y-4">
      {/* Header with streaming indicator and refresh button */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          {isStreaming && (
            <div className="flex items-center mr-2 bg-indigo-50 px-2 py-1 rounded-full">
              <Zap className="h-3 w-3 text-indigo-500 mr-1 animate-pulse" />
              <span className="text-xs text-indigo-600 font-medium">
                AI Streaming
              </span>
            </div>
          )}
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center text-xs text-gray-500">
            <Clock className="h-3 w-3 mr-1" />
            <span>Updated: {formatLastUpdated(lastUpdated)}</span>
          </div>
          <button
            onClick={handleRefresh}
            className="flex items-center gap-1 text-xs bg-white border border-gray-200 hover:bg-gray-50 text-gray-600 px-2 py-1 rounded-md transition-colors"
          >
            <RefreshCw className="h-3 w-3" />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border border-gray-200 rounded-lg overflow-hidden">
        <button
          className={`flex-1 py-2 text-sm font-medium transition-colors ${
            activeTab === "overview"
              ? "bg-indigo-50 text-indigo-600"
              : "bg-white text-gray-600 hover:bg-gray-50"
          }`}
          onClick={() => setActiveTab("overview")}
        >
          Overview
        </button>
        <button
          className={`flex-1 py-2 text-sm font-medium transition-colors ${
            activeTab === "sites"
              ? "bg-indigo-50 text-indigo-600"
              : "bg-white text-gray-600 hover:bg-gray-50"
          }`}
          onClick={() => setActiveTab("sites")}
        >
          Top Sites
        </button>
        <button
          className={`flex-1 py-2 text-sm font-medium transition-colors ${
            activeTab === "authors"
              ? "bg-indigo-50 text-indigo-600"
              : "bg-white text-gray-600 hover:bg-gray-50"
          }`}
          onClick={() => setActiveTab("authors")}
        >
          Top Authors
        </button>
      </div>

      {activeTab === "overview" && (
        <div className="space-y-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-gray-700 flex items-center gap-1">
                <TrendingUp className="h-4 w-4 text-indigo-500" />
                Mentions Over Time
              </h3>
              <span className="text-xs text-gray-500">Last month</span>
            </div>
            <div className="h-60 bg-white rounded-lg border border-gray-200 p-2">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={mentionsOverTime}
                  margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8} />
                      <stop
                        offset="95%"
                        stopColor="#6366f1"
                        stopOpacity={0.1}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#f0f0f0"
                  />
                  <XAxis
                    dataKey="date"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: "#6b7280" }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: "#6b7280" }}
                    width={30}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "white",
                      borderRadius: "0.375rem",
                      border: "1px solid #e5e7eb",
                      boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
                      padding: "0.5rem",
                    }}
                    itemStyle={{ color: "#4f46e5" }}
                    labelStyle={{ fontWeight: "bold", marginBottom: "0.25rem" }}
                  />
                  <Area
                    type="monotone"
                    dataKey="count"
                    stroke="#4f46e5"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorCount)"
                    activeDot={{
                      r: 6,
                      fill: "#4f46e5",
                      stroke: "white",
                      strokeWidth: 2,
                    }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-gray-700 flex items-center gap-1">
                <BarChart2 className="h-4 w-4 text-indigo-500" />
                Conversation Metrics
              </h3>
              <span className="text-xs text-gray-500">Last 30 days</span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gradient-to-br from-white to-indigo-50 p-3 rounded-lg border border-indigo-100/50 shadow-sm">
                <div className="text-2xl font-semibold text-gray-800">
                  {mentionsCount}
                </div>
                <div className="text-xs text-gray-500 flex items-center">
                  <span>Total Mentions</span>
                  {isStreaming && (
                    <div className="ml-1 h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse"></div>
                  )}
                </div>
              </div>
              <div className="bg-gradient-to-br from-white to-indigo-50 p-3 rounded-lg border border-indigo-100/50 shadow-sm">
                <div className="text-2xl font-semibold text-gray-800">
                  +{growth}%
                </div>
                <div className="text-xs text-gray-500">Growth Rate</div>
              </div>
              <div className="bg-gradient-to-br from-white to-indigo-50 p-3 rounded-lg border border-indigo-100/50 shadow-sm">
                <div className="text-2xl font-semibold text-gray-800">
                  {positives}%
                </div>
                <div className="text-xs text-gray-500">Positive Sentiment</div>
              </div>
              <div className="bg-gradient-to-br from-white to-indigo-50 p-3 rounded-lg border border-indigo-100/50 shadow-sm">
                <div className="text-2xl font-semibold text-gray-800">
                  {highImpact}
                </div>
                <div className="text-xs text-gray-500">
                  High Impact Mentions
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "sites" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-700 flex items-center gap-1">
              <Newspaper className="h-4 w-4 text-indigo-500" />
              Top Sites
            </h3>
            <button className="text-xs text-gray-500 flex items-center gap-1 bg-white border border-gray-200 hover:bg-gray-50 px-2 py-1 rounded-md transition-colors">
              <Filter className="h-3 w-3" />
              Filter
            </button>
          </div>

          <div className="space-y-3">
            {/* {topNewsArticles.map((article, index) => (
              <div
                key={article.id}
                className="border border-gray-200 rounded-lg p-3 hover:bg-indigo-50/30 transition-colors bg-white shadow-sm"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex justify-between items-start">
                  <h4 className="text-sm font-medium text-gray-800">
                    {article.title}
                  </h4>
                  <div className="flex items-center gap-1 bg-indigo-100 px-2 py-1 rounded text-xs text-indigo-600 font-medium">
                    <span>Impact</span>
                    <span className="font-semibold">{article.impact}</span>
                  </div>
                </div>
                <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
                  <span>{article.source}</span>
                  <span>{article.date}</span>
                </div>
                {index === 0 && isStreaming && (
                  <div className="mt-1 flex items-center">
                    <div className="h-1 w-1 rounded-full bg-green-500 animate-pulse mr-1"></div>
                    <span className="text-xs text-green-600">
                      Live updating
                    </span>
                  </div>
                )}
              </div>
            ))} */}
            {topSites.map((site, index) => (
              <div
                key={site.id}
                className="border border-gray-200 rounded-lg p-3 hover:bg-indigo-50/30 transition-colors bg-white shadow-sm"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex justify-between items-start">
                  <h4 className="text-sm font-medium text-gray-800">
                    <a href={`https://${site.data.domain}`} target="_blank">
                      {site.data.domain}
                    </a>
                  </h4>
                  <div className="flex items-center gap-1 bg-indigo-100 px-2 py-1 rounded text-xs text-indigo-600 font-medium">
                    <span>Mentions</span>
                    <span className="font-semibold">{site.data.volume}</span>
                  </div>
                </div>
                <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
                  {sentimentSpan(site.data.sentiment)}
                </div>
                {/* {index === 0 && isStreaming && (
                  <div className="mt-1 flex items-center">
                    <div className="h-1 w-1 rounded-full bg-green-500 animate-pulse mr-1"></div>
                    <span className="text-xs text-green-600">
                      Live updating
                    </span>
                  </div>
                )} */}
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === "authors" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-700 flex items-center gap-1">
              <AlertCircle className="h-4 w-4 text-indigo-500" />
              Top Authors
            </h3>
            <button className="text-xs text-gray-500 flex items-center gap-1 bg-white border border-gray-200 hover:bg-gray-50 px-2 py-1 rounded-md transition-colors">
              <Filter className="h-3 w-3" />
              Filter
            </button>
          </div>

          <div className="space-y-3">
            {/* {topMentions.map((mention, index) => (
              <div
                key={mention.id}
                className="border border-gray-200 rounded-lg p-3 hover:bg-indigo-50/30 transition-colors bg-white shadow-sm"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex justify-between items-start">
                  <p className="text-sm text-gray-700">{mention.content}</p>
                  <div className="flex items-center gap-1 bg-indigo-100 px-2 py-1 rounded text-xs text-indigo-600 whitespace-nowrap ml-2 font-medium">
                    <span>Impact</span>
                    <span className="font-semibold">{mention.impact}</span>
                  </div>
                </div>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-xs text-gray-500">
                    {mention.source}
                  </span>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full ${
                      mention.sentiment === "positive"
                        ? "bg-green-100 text-green-700"
                        : mention.sentiment === "negative"
                        ? "bg-red-100 text-red-700"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {mention.sentiment.charAt(0).toUpperCase() +
                      mention.sentiment.slice(1)}
                  </span>
                </div>
                {index === 0 && isStreaming && (
                  <div className="mt-1 flex items-center">
                    <div className="h-1 w-1 rounded-full bg-green-500 animate-pulse mr-1"></div>
                    <span className="text-xs text-green-600">
                      Live updating
                    </span>
                  </div>
                )}
              </div>
            ))} */}
            {topAuthors.map((author, index) => (
              <div
                key={author.id}
                className="border border-gray-200 rounded-lg p-3 hover:bg-indigo-50/30 transition-colors bg-white shadow-sm"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex justify-between items-start">
                  <p className="text-sm text-gray-700">
                    {author.data.twitterPageTitle}
                  </p>
                  <div className="flex items-center gap-1 bg-indigo-100 px-2 py-1 rounded text-xs text-indigo-600 whitespace-nowrap ml-2 font-medium">
                    <span>Impact</span>
                    <span className="font-semibold">{author.data.volume}</span>
                  </div>
                </div>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-xs text-gray-500">
                    {author.data.domain}
                  </span>
                  {sentimentSpan(author.data.sentiment)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CompetitiveIntelligence;
