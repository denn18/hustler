export type DailyTask = {
  id: string;
  title: string;
  description: string;
  minutes: number;
};

export const dailyTasks: DailyTask[] = [
  {
    id: 'focus',
    title: 'Fokus-Block',
    description: 'Arbeite ohne Ablenkung an der wichtigsten Aufgabe des Tages.',
    minutes: 45,
  },
  {
    id: 'outreach',
    title: 'Kundenkontakt',
    description: 'Sende drei konkrete Nachrichten an Leads, Partner oder deine Community.',
    minutes: 20,
  },
  {
    id: 'review',
    title: 'Review',
    description: 'Notiere, was Umsatz, Reichweite oder Klarheit gebracht hat.',
    minutes: 10,
  },
];

export function getTotalMinutes(tasks: DailyTask[]) {
  return tasks.reduce((total, task) => total + task.minutes, 0);
}
