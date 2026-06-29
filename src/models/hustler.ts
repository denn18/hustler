export type EarningsVisibility = 'private' | 'username' | 'anonymousLeaderboard';

export type TutorialStepId = 'intro' | 'createFirstHustle' | 'addTestEntry' | 'viewDashboard';

export type UserProfile = {
  id: string;
  email: string;
  username: string;
  city: string;
  area: string;
  profileImageUri?: string;
  bio?: string;
  offering: string;
  publicDisplayName?: string;
  isMapVisible: boolean;
  isAnonymousProfile: boolean;
  earningsVisibility: EarningsVisibility;
  monthlyProfitGoal: number;
  createdAt: string;
  hasCompletedTutorial: boolean;
  tutorialCompletedAt?: string;
  hustles?: Hustle[];
  hustleEntries?: HustleEntry[];
};

export type Hustle = {
  id: string;
  userId: string;
  title: string;
  description?: string;
  targetMonthlyProfit: number;
  isActive: boolean;
  createdAt: string;
};

export type HustleEntry = {
  id: string;
  hustleId: string;
  revenue: number;
  costs: number;
  hoursWorked: number;
  note?: string;
  earnedAt: string;
};

export type DashboardSummary = {
  user: UserProfile;
  monthlyGoal: number;
  monthlyProfit: number;
  monthlyProgress: number;
  todayProfit: number;
  averageHourlyRate: number;
  hasHustles: boolean;
  hustles: Hustle[];
  recentEntries: HustleEntry[];
};
