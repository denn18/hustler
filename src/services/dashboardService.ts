import type { DashboardSummary, Hustle, HustleEntry, UserProfile } from '../models/hustler';

const mockHustles = (userId: string): Hustle[] => [
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

const mockEntries = (): HustleEntry[] => [
  {
    id: 'entry-today-profit',
    hustleId: 'hustle-design-sprints',
    amount: 180,
    hoursWorked: 5,
    note: 'Landingpage-Audit',
    earnedAt: '2026-06-29T10:00:00.000Z',
  },
  {
    id: 'entry-monthly-profit',
    hustleId: 'hustle-design-sprints',
    amount: 1240,
    hoursWorked: 34.5,
    note: 'Workshop-Paket',
    earnedAt: '2026-06-12T14:00:00.000Z',
  },
];

export function getDashboardSummary(user: UserProfile): DashboardSummary {
  const hustles = mockHustles(user.id);
  const recentEntries = mockEntries();
  const monthlyGoal = hustles.reduce((sum, hustle) => sum + hustle.targetMonthlyProfit, 0);
  const monthlyProfit = recentEntries.reduce((sum, entry) => sum + entry.amount, 0);
  const hoursWorked = recentEntries.reduce((sum, entry) => sum + entry.hoursWorked, 0);

  return {
    user,
    monthlyGoal,
    monthlyProfit,
    monthlyProgress: monthlyGoal > 0 ? monthlyProfit / monthlyGoal : 0,
    todayProfit: recentEntries[0]?.amount ?? 0,
    averageHourlyRate: hoursWorked > 0 ? monthlyProfit / hoursWorked : 0,
    hasHustles: hustles.some((hustle) => hustle.isActive),
    hustles,
    recentEntries,
  };
}
