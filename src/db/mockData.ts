import { ChatMessage, ContactRequest, Customer, Hustle, HustleEntry, RecurringCost, UserProfile } from '@/models/hustler';

export const profile: UserProfile = {
  id: 'user-1',
  email: 'demo@hustler.app',
  username: 'SidePilot',
  city: 'Berlin',
  district: 'Neukölln',
  monthlyGoal: 4000,
  mapVisibility: 'username',
  incomeVisibility: 'username',
  leaderboardMode: 'anonymous',
};

export const hustles: Hustle[] = [
  { id: 'h1', name: 'Reselling', category: 'reselling', icon: 'cube-outline', color: '#3B82F6', isPublic: true, offerTitle: 'Produkt- und Kleinanzeigen-Hilfe', monthlyGoal: 1500 },
  { id: 'h2', name: 'Nachhilfe', category: 'education', icon: 'school-outline', color: '#8B5CF6', isPublic: true, offerTitle: 'Mathe-Nachhilfe im Kiez', monthlyGoal: 900 },
  { id: 'h3', name: 'Rasenmähen', category: 'local', icon: 'leaf-outline', color: '#22C55E', isPublic: false, monthlyGoal: 700 },
];

export const entries: HustleEntry[] = [
  { id: 'e1', hustleId: 'h1', type: 'income', revenue: 180, costs: 45, durationMinutes: 120, date: '2026-06-15', note: 'Sneaker verkauft' },
  { id: 'e2', hustleId: 'h2', type: 'income', revenue: 60, costs: 0, durationMinutes: 90, date: '2026-06-15', customerId: 'c1' },
  { id: 'e3', hustleId: 'h3', type: 'expense', revenue: 0, costs: 18, durationMinutes: 0, date: '2026-06-14', note: 'Benzin' },
  { id: 'e4', hustleId: 'h1', type: 'income', revenue: 220, costs: 80, durationMinutes: 180, date: '2026-06-11' },
];

export const customers: Customer[] = [
  { id: 'c1', name: 'Lukas M.', hustleId: 'h2', note: 'Wöchentlich Dienstag', contact: 'lukas@example.com' },
];

export const recurringCosts: RecurringCost[] = [
  { id: 'r1', hustleId: 'h1', title: 'Listing-Tools', amount: 19, interval: 'monthly', nextDate: '2026-07-01' },
];

export const contactRequests: ContactRequest[] = [
  { id: 'cr1', fromUser: 'FreshRepair', toUser: 'SidePilot', status: 'pending', message: 'Hey, lass uns bei Fahrrad-Aufträgen connecten.' },
];

export const messages: ChatMessage[] = [
  { id: 'm1', chatId: 'chat-1', senderId: 'FreshRepair', text: 'Hi, bist du diese Woche verfügbar?', createdAt: '2026-06-15T09:30:00Z' },
  { id: 'm2', chatId: 'chat-1', senderId: 'SidePilot', text: 'Ja, nachmittags passt gut.', createdAt: '2026-06-15T09:33:00Z' },
];
