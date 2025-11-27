export interface Goal {
  id: string;
  title: string;
  description: string;
  targetAmount: number;
  currentAmount: number;
  imageUrl: string;
  timeHorizon: 'short' | 'medium' | 'long';
  category: 'travel' | 'home' | 'retirement' | 'education' | 'other';
  createdAt: string;
}

export interface Transaction {
  id: string;
  merchantName: string;
  category: string;
  amount: number;
  date: string;
  isImpulse: boolean;
  status: 'pending' | 'diverted' | 'spent';
}

export interface ETFRecommendation {
  ticker: string;
  name: string;
  description: string;
  type: 'index' | 'bond' | 'thematic' | 'esg';
  riskLevel: 'low' | 'moderate' | 'aggressive';
}

export interface Nudge {
  id: string;
  transactionId: string;
  goalId: string;
  amount: number;
  etfRecommendation: ETFRecommendation;
  message: string;
  timestamp: string;
  userAction?: 'invested' | 'ignored';
}

export interface LeaderboardEntry {
  id: string;
  username: string;
  totalDiverted: number;
  streakDays: number;
  badges: string[];
  rank: number;
}
