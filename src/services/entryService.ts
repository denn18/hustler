import type { HustleEntry, PaymentStatus, UserProfile } from '../models/hustler';

export type CreateEntryInput = {
  hustleId: string;
  revenue: number;
  costs: number;
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
};

const normalizeOptionalText = (value?: string): string | undefined => {
  const trimmedValue = value?.trim();
  return trimmedValue || undefined;
};

const normalizeOptionalNumber = (value?: number): number | undefined => {
  if (typeof value !== 'number' || !Number.isFinite(value) || value < 0) {
    return undefined;
  }

  return value;
};

const normalizeRequiredNumber = (value: number, fieldName: string): number => {
  if (typeof value !== 'number' || !Number.isFinite(value) || value < 0) {
    throw new Error(`${fieldName} muss eine Zahl ab 0 sein.`);
  }

  return value;
};

const createEntryId = (userId: string): string => `entry-${userId}-${Date.now()}`;

const buildEarnedAt = (date?: string, time?: string): string => {
  const normalizedDate = normalizeOptionalText(date);
  const normalizedTime = normalizeOptionalText(time);

  if (!normalizedDate) {
    return new Date().toISOString();
  }

  const dateTime = normalizedTime ? `${normalizedDate}T${normalizedTime}` : `${normalizedDate}T00:00`;
  const parsedDate = new Date(dateTime);

  if (Number.isNaN(parsedDate.getTime())) {
    throw new Error('Datum oder Uhrzeit ist ungültig.');
  }

  return parsedDate.toISOString();
};

export const calculateEntryProfit = (entry: Pick<HustleEntry, 'costs' | 'revenue'>): number => entry.revenue - entry.costs;

export const calculateEntryHourlyRate = (entry: Pick<HustleEntry, 'costs' | 'hoursWorked' | 'revenue'>): number => {
  if (entry.hoursWorked <= 0) {
    return 0;
  }

  return calculateEntryProfit(entry) / entry.hoursWorked;
};

export function createEntry(user: UserProfile, input: CreateEntryInput): UserProfile {
  const hustle = user.hustles?.find((currentHustle) => currentHustle.id === input.hustleId && currentHustle.isActive);

  if (!hustle) {
    throw new Error('Bitte wähle einen aktiven Hustle aus.');
  }

  const revenue = normalizeRequiredNumber(input.revenue, 'Einnahme');
  const costs = normalizeRequiredNumber(input.costs, 'Kosten');
  const hoursWorked = normalizeRequiredNumber(input.hoursWorked, 'Zeit');

  if (hoursWorked === 0) {
    throw new Error('Zeit muss größer als 0 sein.');
  }

  const entry: HustleEntry = {
    id: createEntryId(user.id),
    hustleId: hustle.id,
    revenue,
    costs,
    hoursWorked,
    note: normalizeOptionalText(input.note),
    materialCosts: normalizeOptionalNumber(input.materialCosts),
    travelCosts: normalizeOptionalNumber(input.travelCosts),
    platformFees: normalizeOptionalNumber(input.platformFees),
    customer: normalizeOptionalText(input.customer),
    date: normalizeOptionalText(input.date),
    time: normalizeOptionalText(input.time),
    paymentStatus: input.paymentStatus ?? 'paid',
    expenseCategory: normalizeOptionalText(input.expenseCategory),
    earnedAt: buildEarnedAt(input.date, input.time),
  };

  return {
    ...user,
    hustleEntries: [entry, ...(user.hustleEntries ?? [])],
  };
}
