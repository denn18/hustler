import type { DashboardSummary, Hustle, HustleEntry, RecurringCost, UserProfile } from '../models/hustler';
import { calculateEntryProfit } from './entryService';
import { calculateRecurringCostsForMonth } from './recurringCostService';

export type DashboardDataSource = {
  entries?: HustleEntry[];
  hustles?: Hustle[];
  recurringCosts?: RecurringCost[];
};

const localDashboardStore: DashboardDataSource = {
  entries: [],
  hustles: [],
};

const isEntryForHustles = (hustleIds: Set<string>) => (entry: HustleEntry): boolean => hustleIds.has(entry.hustleId);

const normalizeHustle = (hustle: Hustle): Hustle => ({
  ...hustle,
  name: hustle.name || hustle.title || 'Unbenannter Hustle',
  category: hustle.category || 'Allgemein',
});

export function getDashboardSummary(user: UserProfile, dataSource: DashboardDataSource = localDashboardStore): DashboardSummary {
  const hustles = (dataSource.hustles ?? user.hustles ?? [])
    .filter((hustle) => hustle.userId === user.id)
    .map(normalizeHustle);
  const activeHustles = hustles.filter((hustle) => hustle.isActive);
  const activeHustleIds = new Set(activeHustles.map((hustle) => hustle.id));
  const recentEntries = (dataSource.entries ?? []).filter(isEntryForHustles(activeHustleIds));
  const monthlyGoal = user.monthlyProfitGoal;
  const recurringCosts = dataSource.recurringCosts ?? user.recurringCosts ?? [];
  const monthlyRecurringCosts = calculateRecurringCostsForMonth(recurringCosts, new Date(), activeHustleIds);
  // Gewinn wird abhängig vom Eintragstyp berechnet: Einnahmen minus Kosten oder reine Ausgabe negativ.
  // Wiederkehrende Kosten werden als monatliche Hustle-Kosten vom Monatsgewinn abgezogen.
  const monthlyProfit = recentEntries.reduce((sum, entry) => sum + calculateEntryProfit(entry), 0) - monthlyRecurringCosts;
  const hoursWorked = recentEntries.reduce((sum, entry) => sum + entry.hoursWorked, 0);
  const today = new Date().toISOString().slice(0, 10);
  // Gewinn wird abhängig vom Eintragstyp berechnet: Einnahmen minus Kosten oder reine Ausgabe negativ.
  const todayProfit = recentEntries
    .filter((entry) => entry.earnedAt.slice(0, 10) === today)
    .reduce((sum, entry) => sum + calculateEntryProfit(entry), 0);

  return {
    user,
    monthlyGoal,
    monthlyProfit,
    monthlyRecurringCosts,
    monthlyProgress: monthlyGoal > 0 ? monthlyProfit / monthlyGoal : 0,
    todayProfit,
    averageHourlyRate: hoursWorked > 0 ? monthlyProfit / hoursWorked : 0,
    hasHustles: activeHustles.length > 0,
    hustles,
    recentEntries,
  };
}
