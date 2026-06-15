export type VisibilityMode = 'private' | 'anonymous' | 'username';
export type HustleCategory = 'local' | 'online' | 'reselling' | 'delivery' | 'creative' | 'education' | 'craft' | 'other';
export type EntryType = 'income' | 'expense';
export type RecurrenceInterval = 'weekly' | 'monthly' | 'yearly';

export interface UserProfile {
  id: string;
  email: string;
  username: string;
  city: string;
  district: string;
  monthlyGoal: number;
  mapVisibility: VisibilityMode;
  incomeVisibility: VisibilityMode;
  leaderboardMode: VisibilityMode;
}

export interface Hustle {
  id: string;
  name: string;
  category: HustleCategory;
  icon: string;
  color: string;
  isPublic: boolean;
  offerTitle?: string;
  monthlyGoal?: number;
}

export interface HustleEntry {
  id: string;
  hustleId: string;
  type: EntryType;
  revenue: number;
  costs: number;
  durationMinutes: number;
  date: string;
  note?: string;
  customerId?: string;
}

export interface Customer {
  id: string;
  name: string;
  hustleId: string;
  note?: string;
  contact?: string;
}

export interface RecurringCost {
  id: string;
  hustleId: string;
  title: string;
  amount: number;
  interval: RecurrenceInterval;
  nextDate: string;
}

export interface ContactRequest {
  id: string;
  fromUser: string;
  toUser: string;
  status: 'pending' | 'accepted' | 'declined';
  message: string;
}

export interface ChatMessage {
  id: string;
  chatId: string;
  senderId: string;
  text: string;
  imageUri?: string;
  createdAt: string;
}
