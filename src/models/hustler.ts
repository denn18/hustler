export type UserProfile = {
  id: string;
  email: string;
  username: string;
  displayName?: string;
  createdAt: string;
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
  amount: number;
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
