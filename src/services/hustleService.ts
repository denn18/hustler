import type { Hustle, HustleVisibility, UserProfile } from '../models/hustler';

export type CreateHustleInput = {
  name: string;
  category: string;
  icon?: string;
  color?: string;
  description?: string;
  visibility?: HustleVisibility;
  offerDescription?: string;
  targetMonthlyProfit?: number;
  customer?: string;
  notes?: string;
};

const normalizeOptionalText = (value?: string): string | undefined => {
  const trimmedValue = value?.trim();
  return trimmedValue || undefined;
};

const normalizeTargetMonthlyProfit = (value?: number): number | undefined => {
  if (typeof value !== 'number' || !Number.isFinite(value) || value <= 0) {
    return undefined;
  }

  return Math.round(value);
};

const createHustleId = (userId: string): string => `hustle-${userId}-${Date.now()}`;

export function createHustle(user: UserProfile, input: CreateHustleInput): UserProfile {
  const name = input.name.trim();
  const category = input.category.trim();

  if (!name || !category) {
    throw new Error('Name und Kategorie sind Pflichtfelder.');
  }

  const hustle: Hustle = {
    id: createHustleId(user.id),
    userId: user.id,
    name,
    category,
    icon: normalizeOptionalText(input.icon),
    color: normalizeOptionalText(input.color),
    description: normalizeOptionalText(input.description),
    visibility: input.visibility ?? 'private',
    offerDescription: normalizeOptionalText(input.offerDescription),
    targetMonthlyProfit: normalizeTargetMonthlyProfit(input.targetMonthlyProfit),
    customer: normalizeOptionalText(input.customer),
    notes: normalizeOptionalText(input.notes),
    isActive: true,
    createdAt: new Date().toISOString(),
  };

  return {
    ...user,
    hustles: [...(user.hustles ?? []), hustle],
  };
}
