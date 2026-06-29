import type { RecurringCost, RecurringCostInterval, UserProfile } from '../models/hustler';

export type CreateRecurringCostInput = {
  hustleId: string;
  amount: number;
  interval: RecurringCostInterval;
  nextDueDate: string;
  description: string;
  isActive?: boolean;
};

export const recurringCostUseCases = ['Software-Abo', 'Plattformgebühr', 'Lagerkosten', 'Werkzeugmiete', 'Werbung'] as const;

const intervalMonthStep: Record<Extract<RecurringCostInterval, 'monthly' | 'yearly'>, number> = {
  monthly: 1,
  yearly: 12,
};

const normalizeRequiredText = (value: string, fieldName: string): string => {
  const trimmedValue = value.trim();

  if (!trimmedValue) {
    throw new Error(`${fieldName} ist ein Pflichtfeld.`);
  }

  return trimmedValue;
};

const normalizeRequiredAmount = (value: number): number => {
  if (typeof value !== 'number' || !Number.isFinite(value) || value <= 0) {
    throw new Error('Betrag muss eine Zahl größer als 0 sein.');
  }

  return value;
};

const parseDateOnly = (value: string): Date => {
  const date = new Date(`${value.slice(0, 10)}T00:00:00.000Z`);

  if (Number.isNaN(date.getTime())) {
    throw new Error('Fälligkeitsdatum ist ungültig.');
  }

  return date;
};

const createRecurringCostId = (userId: string): string => `recurring-cost-${userId}-${Date.now()}`;

const getMonthStart = (date: Date): Date => new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), 1));

const getNextMonthStart = (date: Date): Date => new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + 1, 1));

const addDays = (date: Date, days: number): Date => new Date(date.getTime() + days * 24 * 60 * 60 * 1000);

const addMonthsClamped = (date: Date, months: number): Date => {
  const year = date.getUTCFullYear();
  const month = date.getUTCMonth();
  const day = date.getUTCDate();
  const targetMonthStart = new Date(Date.UTC(year, month + months, 1));
  const lastDayOfTargetMonth = new Date(Date.UTC(targetMonthStart.getUTCFullYear(), targetMonthStart.getUTCMonth() + 1, 0)).getUTCDate();

  return new Date(Date.UTC(targetMonthStart.getUTCFullYear(), targetMonthStart.getUTCMonth(), Math.min(day, lastDayOfTargetMonth)));
};

const isBefore = (left: Date, right: Date): boolean => left.getTime() < right.getTime();

const isInRange = (date: Date, startInclusive: Date, endExclusive: Date): boolean => !isBefore(date, startInclusive) && isBefore(date, endExclusive);

const getDueDatesInMonth = (cost: RecurringCost, month: Date): Date[] => {
  if (!cost.isActive) {
    return [];
  }

  const monthStart = getMonthStart(month);
  const nextMonthStart = getNextMonthStart(monthStart);
  let dueDate = parseDateOnly(cost.nextDueDate);
  const dueDates: Date[] = [];

  if (cost.interval === 'weekly') {
    while (isBefore(dueDate, monthStart)) {
      dueDate = addDays(dueDate, 7);
    }

    while (isInRange(dueDate, monthStart, nextMonthStart)) {
      dueDates.push(dueDate);
      dueDate = addDays(dueDate, 7);
    }

    return dueDates;
  }

  const monthStep = intervalMonthStep[cost.interval];

  while (isBefore(dueDate, monthStart)) {
    dueDate = addMonthsClamped(dueDate, monthStep);
  }

  if (isInRange(dueDate, monthStart, nextMonthStart)) {
    dueDates.push(dueDate);
  }

  return dueDates;
};

export const calculateRecurringCostAmountForMonth = (cost: RecurringCost, month: Date = new Date()): number => getDueDatesInMonth(cost, month).length * cost.amount;

export const calculateRecurringCostsForMonth = (costs: RecurringCost[] = [], month: Date = new Date(), hustleIds?: Set<string>): number => costs
  .filter((cost) => !hustleIds || hustleIds.has(cost.hustleId))
  .reduce((sum, cost) => sum + calculateRecurringCostAmountForMonth(cost, month), 0);

export function createRecurringCost(user: UserProfile, input: CreateRecurringCostInput): UserProfile {
  const hustle = user.hustles?.find((currentHustle) => currentHustle.id === input.hustleId && currentHustle.isActive);

  if (!hustle) {
    throw new Error('Bitte wähle einen aktiven Hustle aus.');
  }

  const recurringCost: RecurringCost = {
    id: createRecurringCostId(user.id),
    hustleId: hustle.id,
    amount: normalizeRequiredAmount(input.amount),
    interval: input.interval,
    nextDueDate: parseDateOnly(input.nextDueDate).toISOString(),
    description: normalizeRequiredText(input.description, 'Beschreibung'),
    isActive: input.isActive ?? true,
    createdAt: new Date().toISOString(),
  };

  return {
    ...user,
    recurringCosts: [recurringCost, ...(user.recurringCosts ?? [])],
  };
}
