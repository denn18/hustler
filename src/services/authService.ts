import type { EarningsVisibility, UserProfile } from '../models/hustler';

export type SignInProfileInput = {
  area?: string;
  bio?: string;
  city?: string;
  offering?: string;
  profileImageUri?: string;
  publicDisplayName?: string;
  username?: string;
  earningsVisibility?: EarningsVisibility;
};

const createMockUserId = (email: string): string => `mock-user-${email.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;

const normalizeOptionalText = (value?: string): string | undefined => {
  const trimmedValue = value?.trim();
  return trimmedValue || undefined;
};

export function getPublicDisplayName(user: Pick<UserProfile, 'publicDisplayName' | 'username'>): string {
  return user.publicDisplayName?.trim() || user.username;
}

export function signInWithEmail(email: string, password: string, profile: SignInProfileInput = {}): UserProfile {
  const trimmedPassword = password.trim();
  const normalizedEmail = email.trim().toLowerCase();
  const normalizedUsername = profile.username?.trim() || normalizedEmail.split('@')[0] || 'hustler';
  void trimmedPassword;

  return {
    id: createMockUserId(normalizedEmail),
    email: normalizedEmail,
    username: normalizedUsername,
    city: profile.city?.trim() || '',
    area: profile.area?.trim() || '',
    offering: profile.offering?.trim() || '',
    profileImageUri: normalizeOptionalText(profile.profileImageUri),
    bio: normalizeOptionalText(profile.bio),
    publicDisplayName: normalizeOptionalText(profile.publicDisplayName),
    earningsVisibility: profile.earningsVisibility ?? 'private',
    createdAt: new Date().toISOString(),
  };
}
