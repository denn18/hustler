import type { UserProfile } from '../models/hustler';

const createMockUserId = (email: string): string => `mock-user-${email.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;

export function signInWithEmail(email: string, password: string, username?: string): UserProfile {
  const trimmedPassword = password.trim();
  const normalizedEmail = email.trim().toLowerCase();
  const normalizedUsername = username?.trim() || normalizedEmail.split('@')[0] || 'Hustler';
  void trimmedPassword;

  return {
    id: createMockUserId(normalizedEmail),
    email: normalizedEmail,
    username: normalizedUsername,
    displayName: normalizedUsername,
    createdAt: new Date().toISOString(),
  };
}
