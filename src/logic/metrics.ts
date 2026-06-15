import { Hustle, HustleEntry } from '../models/hustler';

export const profitOf = (entry: HustleEntry) => entry.revenue - entry.costs;

export function summarizeEntries(entries: HustleEntry[]) {
  const profit = entries.reduce((sum, entry) => sum + profitOf(entry), 0);
  const minutes = entries.reduce((sum, entry) => sum + entry.durationMinutes, 0);
  return { profit, minutes, hourlyRate: minutes ? profit / (minutes / 60) : 0 };
}

export function statsByHustle(hustles: Hustle[], entries: HustleEntry[]) {
  return hustles.map((hustle) => ({
    hustle,
    ...summarizeEntries(entries.filter((entry) => entry.hustleId === hustle.id)),
  }));
}

export function progress(goal: number, profit: number) {
  return Math.max(0, Math.min(100, Math.round((profit / goal) * 100)));
}
