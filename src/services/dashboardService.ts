import type { DashboardSummary, Hustle, HustleEntry, UserProfile } from '../models/hustler';

const fallbackHustles = (userId: string): Hustle[] => [
  {
    id: 'hustle-design-sprints',
    userId,
    title: 'Design Sprints',
    description: 'Workshops und Landingpage-Reviews für lokale Businesses.',
    targetMonthlyProfit: 2500,
    isActive: true,
    createdAt: '2026-06-01T08:00:00.000Z',
  },
];

const fallbackEntries = (): HustleEntry[] => [
  {
    id: 'entry-today-profit',
    hustleId: 'hustle-design-sprints',
    revenue: 220,
    costs: 40,
    hoursWorked: 5,
    note: 'Landingpage-Audit',
    earnedAt: '2026-06-29T10:00:00.000Z',
  },
  {
    id: 'entry-monthly-profit',
    hustleId: 'hustle-design-sprints',
    revenue: 1500,
    costs: 260,
    hoursWorked: 34.5,
    note: 'Workshop-Paket',
    earnedAt: '2026-06-12T14:00:00.000Z',
  },
];

export function getDashboardSummary(user: UserProfile): DashboardSummary {
  const hustles = user.hustles ?? fallbackHustles(user.id);
  const hustleIds = new Set(hustles.map((hustle) => hustle.id));
  const recentEntries = (user.hustleEntries ?? fallbackEntries()).filter((entry) => hustleIds.has(entry.hustleId));
  const monthlyGoal = user.monthlyProfitGoal;
  // Gewinn wird bewusst als Einnahmen minus Kosten berechnet.
  const monthlyProfit = recentEntries.reduce((sum, entry) => sum + entry.revenue - entry.costs, 0);
  const hoursWorked = recentEntries.reduce((sum, entry) => sum + entry.hoursWorked, 0);
  // Gewinn wird bewusst als Einnahmen minus Kosten berechnet.
  const todayProfit = recentEntries[0] ? recentEntries[0].revenue - recentEntries[0].costs : 0;

  return {
    user,
    monthlyGoal,
    monthlyProfit,
    monthlyProgress: monthlyGoal > 0 ? monthlyProfit / monthlyGoal : 0,
    todayProfit,
    averageHourlyRate: hoursWorked > 0 ? monthlyProfit / hoursWorked : 0,
    hasHustles: hustles.some((hustle) => hustle.isActive),
    hustles,
    recentEntries,
  };
}
