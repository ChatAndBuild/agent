import { makeProxyRequest } from "./proxyService";

// API configuration
const API_BASE_URL = import.meta.env.VITE_BRANDWATCH_API_URL;
const ACCESS_TOKEN = import.meta.env.VITE_BRANDWATCH_ACCESS_TOKEN;

// Project and query constants
export const DEFAULT_PROJECT_ID = "1998389831"; // Default Brandwatch project ID
export const DEFAULT_QUERY_ID = "2003239625"; // Default query ID for CZ Binance

const today = new Date();
export const startDate = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
export const endDate = today;

const startDateString = startDate.toISOString();
const endDateString = endDate.toISOString();

// Mock data for development
const mockMentionsData = {
  results: [
    { date: "2023-06-01", volume: 120 },
    { date: "2023-06-08", volume: 145 },
    { date: "2023-06-15", volume: 180 },
    { date: "2023-06-22", volume: 210 },
    { date: "2023-06-29", volume: 190 }
  ]
};

const mockTotalMentions = { count: 845 };

const mockSentiment = {
  results: [
    { date: "2023-06-01", positive: 40, neutral: 60, negative: 20 },
    { date: "2023-06-08", positive: 50, neutral: 70, negative: 25 },
    { date: "2023-06-15", positive: 60, neutral: 90, negative: 30 },
    { date: "2023-06-22", positive: 70, neutral: 100, negative: 40 },
    { date: "2023-06-29", positive: 65, neutral: 95, negative: 30 }
  ]
};

const mockHighImpact = {
  results: [
    { profession: "Journalist", volume: 120 },
    { profession: "Influencer", volume: 200 },
    { profession: "Industry Expert", volume: 150 },
    { profession: "General Public", volume: 375 }
  ]
};

const mockTopSites = {
  results: [
    { name: "Twitter", volume: 300 },
    { name: "Reddit", volume: 200 },
    { name: "Medium", volume: 150 },
    { name: "LinkedIn", volume: 100 },
    { name: "News Sites", volume: 95 }
  ]
};

const mockTopAuthors = {
  results: [
    { name: "crypto_expert", volume: 45 },
    { name: "blockchain_news", volume: 38 },
    { name: "fintech_daily", volume: 32 },
    { name: "crypto_analyst", volume: 28 },
    { name: "tech_insider", volume: 25 }
  ]
};

// Get mentions overview
export const getMentionsOverview = async () => {
  try {
    const url = `${API_BASE_URL}/projects/${DEFAULT_PROJECT_ID}/data/volume/queries/weeks?queryId=${DEFAULT_QUERY_ID}&startDate=${startDateString}&endDate=${endDateString}`;
    const headers = {
      Authorization: `Bearer ${ACCESS_TOKEN}`,
    };
    return await makeProxyRequest(url, "GET", headers);
  } catch (error) {
    console.error("Error fetching mentions overview:", error);
    return mockMentionsData;
  }
};

// Get total mentions
export const getTotalMentions = async () => {
  try {
    const url = `${API_BASE_URL}/projects/${DEFAULT_PROJECT_ID}/data/mentions/count?queryId=${DEFAULT_QUERY_ID}&startDate=${startDateString}&endDate=${endDateString}`;
    const headers = {
      Authorization: `Bearer ${ACCESS_TOKEN}`,
    };
    return await makeProxyRequest(url, "GET", headers);
  } catch (error) {
    console.error("Error fetching total mentions:", error);
    return mockTotalMentions;
  }
};

// Get sentiment
export const getSentiment = async () => {
  try {
    const url = `${API_BASE_URL}/projects/${DEFAULT_PROJECT_ID}/data/volume/sentiment/months?queryId=${DEFAULT_QUERY_ID}&startDate=${startDateString}&endDate=${endDateString}`;
    const headers = {
      Authorization: `Bearer ${ACCESS_TOKEN}`,
    };
    return await makeProxyRequest(url, "GET", headers);
  } catch (error) {
    console.error("Error fetching sentiment data:", error);
    return mockSentiment;
  }
};

// Get high impact mentions
export const getHighImpact = async () => {
  try {
    const url = `${API_BASE_URL}/projects/${DEFAULT_PROJECT_ID}/data/volume/queries/profession?queryId=${DEFAULT_QUERY_ID}&startDate=${startDateString}&endDate=${endDateString}`;
    const headers = {
      Authorization: `Bearer ${ACCESS_TOKEN}`,
    };
    return await makeProxyRequest(url, "GET", headers);
  } catch (error) {
    console.error("Error fetching high impact data:", error);
    return mockHighImpact;
  }
};

// Get top sites
export const getTopSites = async () => {
  try {
    const url = `${API_BASE_URL}/projects/${DEFAULT_PROJECT_ID}/data/volume/topsites/queries?queryId=${DEFAULT_QUERY_ID}&startDate=${startDateString}&endDate=${endDateString}`;
    const headers = {
      Authorization: `Bearer ${ACCESS_TOKEN}`,
    };
    return await makeProxyRequest(url, "GET", headers);
  } catch (error) {
    console.error("Error fetching top sites:", error);
    return mockTopSites;
  }
};

// Get top authors
export const getTopAuthors = async () => {
  try {
    const url = `${API_BASE_URL}/projects/${DEFAULT_PROJECT_ID}/data/volume/topauthors/queries?queryId=${DEFAULT_QUERY_ID}&startDate=${startDateString}&endDate=${endDateString}`;
    const headers = {
      Authorization: `Bearer ${ACCESS_TOKEN}`,
    };
    return await makeProxyRequest(url, "GET", headers);
  } catch (error) {
    console.error("Error fetching top authors:", error);
    return mockTopAuthors;
  }
};
