import { useState } from 'react';
import { Pressable, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TextInput, View } from 'react-native';

import { colors, radii, spacing } from '../design/theme';
import { signInWithEmail, type SignInProfileInput } from '../services/authService';
import type { EarningsVisibility, UserProfile } from '../models/hustler';

type AuthPageProps = {
  onAuthenticate: (user: UserProfile) => void;
};

const monthlyProfitGoalOptions = [500, 1000, 2500, 4000] as const;

type MonthlyProfitGoalOption = (typeof monthlyProfitGoalOptions)[number] | 'custom';

const earningsVisibilityOptions: Array<{ label: string; value: EarningsVisibility }> = [
  { label: 'Einnahmen privat', value: 'private' },
  { label: 'Einnahmen mit Username sichtbar', value: 'username' },
  { label: 'anonym fürs Leaderboard', value: 'anonymousLeaderboard' },
];

export function AuthPage({ onAuthenticate }: AuthPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedMonthlyProfitGoal, setSelectedMonthlyProfitGoal] = useState<MonthlyProfitGoalOption>(1000);
  const [customMonthlyProfitGoal, setCustomMonthlyProfitGoal] = useState('');
  const [profileDraft, setProfileDraft] = useState<SignInProfileInput>({
    area: '',
    bio: '',
    city: '',
    offering: '',
    earningsVisibility: 'private',
    monthlyProfitGoal: 1000,
    profileImageUri: '',
    username: '',
  });

  function updateProfileDraft(field: keyof SignInProfileInput) {
    return (value: string) => {
      setProfileDraft((currentDraft) => ({ ...currentDraft, [field]: value }));
    };
  }

  function updateEarningsVisibility(earningsVisibility: EarningsVisibility) {
    setProfileDraft((currentDraft) => ({ ...currentDraft, earningsVisibility }));
  }

  function updateMonthlyProfitGoal(monthlyProfitGoal: MonthlyProfitGoalOption) {
    setSelectedMonthlyProfitGoal(monthlyProfitGoal);

    if (monthlyProfitGoal !== 'custom') {
      setProfileDraft((currentDraft) => ({ ...currentDraft, monthlyProfitGoal }));
    }
  }

  function updateCustomMonthlyProfitGoal(value: string) {
    setCustomMonthlyProfitGoal(value);

    const parsedMonthlyProfitGoal = Number(value.replace(',', '.'));
    setProfileDraft((currentDraft) => ({
      ...currentDraft,
      monthlyProfitGoal: Number.isFinite(parsedMonthlyProfitGoal) ? parsedMonthlyProfitGoal : undefined,
    }));
  }

  function handleSubmit() {
    onAuthenticate(signInWithEmail(email, password, profileDraft));
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" />
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <View style={styles.hero}>
          <Text style={styles.kicker}>Hustler</Text>
          <Text style={styles.title}>Willkommen zurück</Text>
          <Text style={styles.subtitle}>
            Melde dich an oder registriere dich lokal, um deinen ersten Hustle-Flow zu starten.
          </Text>
        </View>

        <View style={styles.formCard}>
          <Text style={styles.label}>E-Mail</Text>
          <TextInput
            autoCapitalize="none"
            keyboardType="email-address"
            onChangeText={setEmail}
            placeholder="du@beispiel.de"
            placeholderTextColor={colors.mutedText}
            style={styles.input}
            value={email}
          />

          <Text style={styles.label}>Username</Text>
          <TextInput
            autoCapitalize="none"
            onChangeText={updateProfileDraft('username')}
            placeholder="dein-hustle-name"
            placeholderTextColor={colors.mutedText}
            style={styles.input}
            value={profileDraft.username}
          />

          <Text style={styles.label}>Passwort</Text>
          <TextInput
            onChangeText={setPassword}
            placeholder="••••••••"
            placeholderTextColor={colors.mutedText}
            secureTextEntry
            style={styles.input}
            value={password}
          />

          <Text style={styles.label}>Stadt</Text>
          <TextInput
            onChangeText={updateProfileDraft('city')}
            placeholder="Berlin"
            placeholderTextColor={colors.mutedText}
            style={styles.input}
            value={profileDraft.city}
          />

          <Text style={styles.label}>Stadtteil / ungefährer Bereich</Text>
          <TextInput
            onChangeText={updateProfileDraft('area')}
            placeholder="z. B. Kreuzberg oder Nähe Hauptbahnhof"
            placeholderTextColor={colors.mutedText}
            style={styles.input}
            value={profileDraft.area}
          />

          <Text style={styles.label}>Was bietest du an?</Text>
          <TextInput
            onChangeText={updateProfileDraft('offering')}
            placeholder="z. B. Design Sprints"
            placeholderTextColor={colors.mutedText}
            style={styles.input}
            value={profileDraft.offering}
          />


          <Text style={styles.label}>Monatliches Gewinnziel</Text>
          <View style={styles.visibilityOptions}>
            {monthlyProfitGoalOptions.map((monthlyProfitGoal) => {
              const isSelected = selectedMonthlyProfitGoal === monthlyProfitGoal;

              return (
                <Pressable
                  accessibilityRole="radio"
                  accessibilityState={{ selected: isSelected }}
                  key={monthlyProfitGoal}
                  onPress={() => updateMonthlyProfitGoal(monthlyProfitGoal)}
                  style={[styles.visibilityOption, isSelected && styles.visibilityOptionSelected]}
                >
                  <View style={[styles.radioIndicator, isSelected && styles.radioIndicatorSelected]} />
                  <Text style={[styles.visibilityOptionText, isSelected && styles.visibilityOptionTextSelected]}>
                    {monthlyProfitGoal.toLocaleString('de-DE')} € Gewinnziel
                  </Text>
                </Pressable>
              );
            })}
            <Pressable
              accessibilityRole="radio"
              accessibilityState={{ selected: selectedMonthlyProfitGoal === 'custom' }}
              onPress={() => updateMonthlyProfitGoal('custom')}
              style={[styles.visibilityOption, selectedMonthlyProfitGoal === 'custom' && styles.visibilityOptionSelected]}
            >
              <View
                style={[
                  styles.radioIndicator,
                  selectedMonthlyProfitGoal === 'custom' && styles.radioIndicatorSelected,
                ]}
              />
              <Text
                style={[
                  styles.visibilityOptionText,
                  selectedMonthlyProfitGoal === 'custom' && styles.visibilityOptionTextSelected,
                ]}
              >
                Eigenes Gewinnziel
              </Text>
            </Pressable>
          </View>
          {selectedMonthlyProfitGoal === 'custom' ? (
            <TextInput
              keyboardType="numeric"
              onChangeText={updateCustomMonthlyProfitGoal}
              placeholder="Dein monatliches Gewinnziel in €"
              placeholderTextColor={colors.mutedText}
              style={styles.input}
              value={customMonthlyProfitGoal}
            />
          ) : null}

          <Text style={styles.label}>Sichtbarkeit deiner Einnahmen</Text>
          <View style={styles.visibilityOptions}>
            {earningsVisibilityOptions.map((option) => {
              const isSelected = profileDraft.earningsVisibility === option.value;

              return (
                <Pressable
                  accessibilityRole="radio"
                  accessibilityState={{ selected: isSelected }}
                  key={option.value}
                  onPress={() => updateEarningsVisibility(option.value)}
                  style={[styles.visibilityOption, isSelected && styles.visibilityOptionSelected]}
                >
                  <View style={[styles.radioIndicator, isSelected && styles.radioIndicatorSelected]} />
                  <Text style={[styles.visibilityOptionText, isSelected && styles.visibilityOptionTextSelected]}>
                    {option.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
          <Text style={styles.visibilityHint}>
            Sicherer Standard: Einnahmen bleiben privat, bis du aktiv etwas anderes auswählst.
          </Text>

          <Text style={styles.label}>Profilbild-URI (optional)</Text>
          <TextInput
            autoCapitalize="none"
            onChangeText={updateProfileDraft('profileImageUri')}
            placeholder="https://... oder file://..."
            placeholderTextColor={colors.mutedText}
            style={styles.input}
            value={profileDraft.profileImageUri}
          />

          <Text style={styles.label}>Bio (optional)</Text>
          <TextInput
            multiline
            onChangeText={updateProfileDraft('bio')}
            placeholder="Kurzbeschreibung deines Hustles"
            placeholderTextColor={colors.mutedText}
            style={[styles.input, styles.textArea]}
            value={profileDraft.bio}
          />

          <Pressable style={styles.button} onPress={handleSubmit}>
            <Text style={styles.buttonText}>Einloggen / Registrieren</Text>
          </Pressable>

          <Text style={styles.hint}>
            Auth ist für diesen Prototyp nur lokal gemockt, damit der App-Flow ohne Backend startfähig ist.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: radii.md,
    marginTop: spacing.sm,
    padding: spacing.md,
  },
  buttonText: {
    color: colors.background,
    fontSize: 16,
    fontWeight: '800',
  },
  content: {
    flexGrow: 1,
    gap: spacing.lg,
    justifyContent: 'center',
    padding: spacing.lg,
    paddingBottom: spacing.xl,
  },
  formCard: {
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderRadius: radii.lg,
    borderWidth: 1,
    gap: spacing.sm,
    padding: spacing.lg,
  },
  hero: {
    gap: spacing.sm,
  },
  hint: {
    color: colors.mutedText,
    fontSize: 13,
    lineHeight: 19,
    marginTop: spacing.xs,
  },
  input: {
    backgroundColor: colors.background,
    borderColor: colors.border,
    borderRadius: radii.md,
    borderWidth: 1,
    color: colors.text,
    fontSize: 16,
    marginBottom: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
  },
  kicker: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  label: {
    color: colors.primaryText,
    fontSize: 14,
    fontWeight: '700',
  },
  safeArea: {
    backgroundColor: colors.background,
    flex: 1,
  },
  radioIndicator: {
    borderColor: colors.border,
    borderRadius: 7,
    borderWidth: 2,
    height: 14,
    width: 14,
  },
  radioIndicatorSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  textArea: {
    minHeight: 96,
    textAlignVertical: 'top',
  },
  subtitle: {
    color: colors.mutedText,
    fontSize: 16,
    lineHeight: 24,
  },
  visibilityHint: {
    color: colors.mutedText,
    fontSize: 13,
    lineHeight: 19,
    marginBottom: spacing.sm,
  },
  visibilityOption: {
    alignItems: 'center',
    backgroundColor: colors.background,
    borderColor: colors.border,
    borderRadius: radii.md,
    borderWidth: 1,
    flexDirection: 'row',
    gap: spacing.sm,
    padding: spacing.md,
  },
  visibilityOptionSelected: {
    borderColor: colors.primary,
  },
  visibilityOptions: {
    gap: spacing.sm,
    marginBottom: spacing.xs,
  },
  visibilityOptionText: {
    color: colors.text,
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
  },
  visibilityOptionTextSelected: {
    color: colors.primaryText,
  },
  title: {
    color: colors.text,
    fontSize: 34,
    fontWeight: '900',
  },
});
