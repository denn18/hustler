import { entries, hustles } from '@/db/mockData';
import { statsByHustle, summarizeEntries } from '@/logic/metrics';

export function getDashboardData() {
  const today = '2026-06-15';
  const todayEntries = entries.filter((entry) => entry.date === today);
  return {
    hustles,
    entries,
    today: summarizeEntries(todayEntries),
    month: summarizeEntries(entries),
    hustleStats: statsByHustle(hustles, entries),
  };
}
