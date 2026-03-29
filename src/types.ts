export type Role = 'Investor' | 'Founder' | 'Executive' | 'Policy Analyst' | 'Student' | 'Journalist' | 'Other';
export type Industry = 'FinTech' | 'Energy' | 'AI & Tech' | 'Healthcare' | 'Markets' | 'Real Estate' | 'Manufacturing' | 'Global Trade';
export type Geography = 'India' | 'USA' | 'Europe' | 'Asia-Pacific' | 'Global';
export type DepthPreference = 'Headlines' | 'Deep analysis';
export type FormatPreference = 'Narrative' | 'Data-first' | 'Bullet summary' | 'Podcast-style';
export type TimeAvailable = '< 5 min' | '10–15 min' | '30+ min';

export interface UserProfile {
  name: string;
  role: Role;
  industries: Industry[];
  geography: Geography;
  depth: number; // 0 to 100
  format: FormatPreference;
  timeAvailable: TimeAvailable;
  watchlistCompanies: string[];
  watchlistTopics: string[];
  watchlistPeople: string[];
  isInvestor: boolean;
  portfolio: { ticker: string; allocation: number }[];
}

export interface Article {
  id: string;
  category: string;
  headline: string;
  summary: string;
  content: string;
  source: string;
  timeAgo: string;
  readTime: string;
  relevance: 'High Match' | 'Watchlist' | 'Portfolio Alert';
  sentiment: 'Bullish' | 'Bearish' | 'Neutral' | 'Watch';
  sector: Industry;
  entities?: string[];
  relevanceScore?: number;
}

export interface UserEngagement {
  clickedIds: string[];
  savedIds: string[];
  preferredSectors: { [key in Industry]?: number };
}

export interface ProcessingStep {
  id: string;
  label: string;
  status: 'pending' | 'processing' | 'completed' | 'error';
}

export interface Company {
  id: string;
  name: string;
  ticker: string;
  description: string;
  price: number;
  change: number;
  sentiment: number; // 0 to 100
  logo: string;
}

export interface MarketIndex {
  name: string;
  value: number;
  change: number;
  changePercent: number;
  sparkline: { name: string; value: number }[];
}

export interface Message {
  role: 'user' | 'assistant';
  content: string;
}
