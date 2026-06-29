import type { HustleEntry, HustleEntryType, PaymentStatus, UserProfile } from '../models/hustler';

export type CreateEntryInput = {
  hustleId: string;
  type: HustleEntryType;
  incomeAmount: number;
  expenseAmount: number;
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

export const getEntryIncomeAmount = (entry: Pick<HustleEntry, 'incomeAmount' | 'revenue'>): number => entry.incomeAmount ?? entry.revenue ?? 0;

export const getEntryExpenseAmount = (entry: Pick<HustleEntry, 'costs' | 'expenseAmount'>): number => entry.expenseAmount ?? entry.costs ?? 0;

export const calculateEntryProfit = (entry: Pick<HustleEntry, 'costs' | 'expenseAmount' | 'incomeAmount' | 'revenue' | 'type'>): number => {
  const expenseAmount = getEntryExpenseAmount(entry);

  if (entry.type === 'expense') {
    return -expenseAmount;
  }

  return getEntryIncomeAmount(entry) - expenseAmount;
};

export const calculateEntryHourlyRate = (entry: Pick<HustleEntry, 'costs' | 'expenseAmount' | 'hoursWorked' | 'incomeAmount' | 'revenue' | 'type'>): number => {
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

  const incomeAmount = normalizeRequiredNumber(input.incomeAmount, 'Einnahme');
  const expenseAmount = normalizeRequiredNumber(input.expenseAmount, 'Ausgabe');
  const hoursWorked = normalizeRequiredNumber(input.hoursWorked, 'Zeit');

  if (hoursWorked === 0) {
    throw new Error('Zeit muss größer als 0 sein.');
  }

  const entry: HustleEntry = {
    id: createEntryId(user.id),
    hustleId: hustle.id,
    type: input.type,
    incomeAmount,
    expenseAmount,
    revenue: incomeAmount,
    costs: expenseAmount,
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
    reason: normalizeOptionalText(input.reason),
    earnedAt: buildEarnedAt(input.date, input.time),
  };

  return {
    ...user,
    hustleEntries: [entry, ...(user.hustleEntries ?? [])],
  };
}
