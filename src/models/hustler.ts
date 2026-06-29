export type EarningsVisibility = 'private' | 'username' | 'anonymousLeaderboard';
export type HustleVisibility = 'private' | 'publicProfile' | 'publicOffer';

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
  name: string;
  /**
   * @deprecated Use `name` for the visible hustle name. `title` is kept as a
   * temporary compatibility alias for older persisted mock data.
   */
  title?: string;
  category: string;
  icon?: string;
  color?: string;
  description?: string;
  visibility?: HustleVisibility;
  offerTitle?: string;
  offerDescription?: string;
  targetMonthlyProfit?: number;
  customer?: string;
  notes?: string;
  isActive: boolean;
  createdAt: string;
};

export const getHustleDisplayName = (hustle: Pick<Hustle, 'name' | 'title'>): string => hustle.name || hustle.title || 'Unbenannter Hustle';

export type PaymentStatus = 'open' | 'paid' | 'overdue';
export type HustleEntryType = 'income' | 'expense';

export type HustleEntry = {
  id: string;
  hustleId: string;
  type: HustleEntryType;
  incomeAmount: number;
  expenseAmount: number;
  /**
   * @deprecated Use `incomeAmount` for newly created entries. Kept as a
   * compatibility alias for older persisted mock data.
   */
  revenue?: number;
  /**
   * @deprecated Use `expenseAmount` for newly created entries. Kept as a
   * compatibility alias for older persisted mock data.
   */
  costs?: number;
  hoursWorked: number;
  note?: string;
  materialCosts?: number;
  travelCosts?: number;
  platformFees?: number;
  customer?: string;
  date?: string;
  time?: string;
  paymentStatus?: PaymentStatus;
  expenseCategory?: string;
  reason?: string;
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
