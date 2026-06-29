import type { DashboardSummary, Hustle, HustleEntry, UserProfile } from '../models/hustler';

export type DashboardDataSource = {
  entries?: HustleEntry[];
  hustles?: Hustle[];
};

const localDashboardStore: DashboardDataSource = {
  entries: [],
  hustles: [],
};

const isEntryForHustles = (hustleIds: Set<string>) => (entry: HustleEntry): boolean => hustleIds.has(entry.hustleId);

export function getDashboardSummary(user: UserProfile, dataSource: DashboardDataSource = localDashboardStore): DashboardSummary {
  const hustles = (dataSource.hustles ?? []).filter((hustle) => hustle.userId === user.id);
  const activeHustles = hustles.filter((hustle) => hustle.isActive);
  const activeHustleIds = new Set(activeHustles.map((hustle) => hustle.id));
  const recentEntries = (dataSource.entries ?? []).filter(isEntryForHustles(activeHustleIds));
  const monthlyGoal = user.monthlyProfitGoal;
  // Gewinn wird bewusst als Einnahmen minus Kosten berechnet.
  const monthlyProfit = recentEntries.reduce((sum, entry) => sum + entry.revenue - entry.costs, 0);
  const hoursWorked = recentEntries.reduce((sum, entry) => sum + entry.hoursWorked, 0);
  const today = new Date().toISOString().slice(0, 10);
  // Gewinn wird bewusst als Einnahmen minus Kosten berechnet.
  const todayProfit = recentEntries
    .filter((entry) => entry.earnedAt.slice(0, 10) === today)
    .reduce((sum, entry) => sum + entry.revenue - entry.costs, 0);

  return {
    user,
    monthlyGoal,
    monthlyProfit,
    monthlyProgress: monthlyGoal > 0 ? monthlyProfit / monthlyGoal : 0,
    todayProfit,
    averageHourlyRate: hoursWorked > 0 ? monthlyProfit / hoursWorked : 0,
    hasHustles: activeHustles.length > 0,
    hustles,
    recentEntries,
  };
}
