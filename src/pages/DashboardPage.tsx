import { useEffect, useState } from 'react';
import { Pressable, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TextInput, View } from 'react-native';

import { colors, radii, spacing } from '../design/theme';
import { getHustleDisplayName, type EarningsVisibility, type UserProfile } from '../models/hustler';
import { getPublicDisplayName } from '../services/authService';
import { type DashboardDataSource, getDashboardSummary } from '../services/dashboardService';

type DashboardPageProps = {
  onUpdateUser: (user: UserProfile) => void;
  user: UserProfile;
};

const formatEuro = (value: number): string => `€${Math.round(value).toLocaleString('de-DE')}`;

export function DashboardPage({ onUpdateUser, user }: DashboardPageProps) {
  const [dashboardData] = useState<DashboardDataSource>({
    entries: user.hustleEntries ?? [],
    hustles: user.hustles ?? [],
  });
  const summary = getDashboardSummary(user, dashboardData);
  const activeHustles = summary.hustles.filter((hustle) => hustle.isActive);
  const publicDisplayName = getPublicDisplayName(summary.user);
  const location = [summary.user.area, summary.user.city].filter(Boolean).join(', ');
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.kicker}>Dashboard</Text>
          <Text style={styles.title}>Hi {publicDisplayName} 👋</Text>
          <Text style={styles.subtitle}>Dein kompakter Überblick für Ziele, Gewinne und Hustles.</Text>
          {(location || summary.user.offering || summary.user.bio) ? (
            <View style={styles.profileCard}>
              {location ? <Text style={styles.profileMeta}>{location}</Text> : null}
              {summary.user.offering ? <Text style={styles.profileOffering}>{summary.user.offering}</Text> : null}
              {summary.user.bio ? <Text style={styles.profileBio}>{summary.user.bio}</Text> : null}
            </View>
          ) : null}
        </View>

        <View style={styles.goalCard}>
          <View style={styles.rowBetween}>
            <Text style={styles.cardTitle}>Monatsziel-Fortschritt</Text>
            <Text style={styles.progressValue}>{Math.round(summary.monthlyProgress * 100)}%</Text>
          </View>
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${Math.min(summary.monthlyProgress, 1) * 100}%` }]} />
          </View>
          <Text style={styles.muted}>{formatEuro(summary.monthlyProfit)} von {formatEuro(summary.monthlyGoal)}</Text>
        </View>

        <View style={styles.metricGrid}>
          <MetricCard label="Heutiger Gewinn" value={formatEuro(summary.todayProfit)} />
          <MetricCard label="Monatsgewinn" value={formatEuro(summary.monthlyProfit)} />
          <MetricCard label="Ø Stundenlohn" value={`${formatEuro(summary.averageHourlyRate)}/h`} />
        </View>

        <SettingsSection onUpdateUser={onUpdateUser} user={user} />

        <View style={styles.hustlesCard}>
          <View style={styles.rowBetween}>
            <Text style={styles.cardTitle}>Meine Hustles</Text>
            <Text style={styles.badge}>{summary.hasHustles ? `${activeHustles.length} aktiv` : 'Neu'}</Text>
          </View>
          {summary.hasHustles ? (
            <>
              <Text style={styles.muted}>Deine aktiven Hustles und der schnelle Weg zur nächsten Einnahme.</Text>
              <View style={styles.hustleList}>
                {activeHustles.map((hustle) => (
                  <View key={hustle.id} style={styles.hustleListItem}>
                    <View style={styles.sectionTitleGroup}>
                      <Text style={styles.hustleTitle}>{getHustleDisplayName(hustle)}</Text>
                      {hustle.description ? <Text style={styles.muted}>{hustle.description}</Text> : null}
                      <Text style={styles.muted}>{hustle.category}</Text>
                    </View>
                    {hustle.targetMonthlyProfit ? (
                      <Text style={styles.hustleGoal}>{formatEuro(hustle.targetMonthlyProfit)}</Text>
                    ) : null}
                  </View>
                ))}
              </View>
              <Pressable style={styles.button}>
                <Text style={styles.buttonText}>+ Einnahme</Text>
              </Pressable>
            </>
          ) : (
            <EmptyHustlesState />
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}



function EmptyHustlesState() {
  return (
    <View style={styles.emptyState}>
      <Text style={styles.emptyStateTitle}>Noch keine Hustles</Text>
      <Text style={styles.muted}>Lege deinen ersten Hustle an und tracke Einnahmen direkt im Dashboard.</Text>
      <Pressable style={styles.button}>
        <Text style={styles.buttonText}>Ersten Hustle erstellen</Text>
      </Pressable>
    </View>
  );
}

const earningsVisibilityOptions: Array<{ description: string; label: string; value: EarningsVisibility }> = [
  { description: 'Nur du siehst deine Zahlen.', label: 'Privat', value: 'private' },
  { description: 'Dein Username darf neben Einnahmen erscheinen.', label: 'Mit Username', value: 'username' },
  { description: 'Einnahmen können anonym im Leaderboard landen.', label: 'Anonymes Leaderboard', value: 'anonymousLeaderboard' },
];

function SettingsSection({ onUpdateUser, user }: DashboardPageProps) {
  const [monthlyProfitGoalInput, setMonthlyProfitGoalInput] = useState(String(user.monthlyProfitGoal));

  useEffect(() => {
    setMonthlyProfitGoalInput(String(user.monthlyProfitGoal));
  }, [user.id, user.monthlyProfitGoal]);

  function updateUserSetting(updates: Partial<UserProfile>) {
    onUpdateUser({ ...user, ...updates });
  }

  function updateTextSetting(field: 'area' | 'city') {
    return (value: string) => updateUserSetting({ [field]: value });
  }

  function updateMonthlyProfitGoal(value: string) {
    setMonthlyProfitGoalInput(value);

    const parsedMonthlyProfitGoal = Number(value.replace(',', '.'));
    if (Number.isFinite(parsedMonthlyProfitGoal) && parsedMonthlyProfitGoal > 0) {
      updateUserSetting({ monthlyProfitGoal: Math.round(parsedMonthlyProfitGoal) });
    }
  }

  return (
    <View style={styles.settingsCard}>
      <View style={styles.rowBetween}>
        <View style={styles.sectionTitleGroup}>
          <Text style={styles.cardTitle}>Einstellungen</Text>
          <Text style={styles.muted}>Lokale Profileinstellungen für Sichtbarkeit, Standort und Monatsziel.</Text>
        </View>
        <Text style={styles.badge}>Lokal</Text>
      </View>

      <Text style={styles.label}>Sichtbarkeit deiner Einnahmen</Text>
      <View style={styles.optionStack}>
        {earningsVisibilityOptions.map((option) => {
          const isSelected = user.earningsVisibility === option.value;

          return (
            <Pressable
              accessibilityRole="radio"
              accessibilityState={{ selected: isSelected }}
              key={option.value}
              onPress={() => updateUserSetting({ earningsVisibility: option.value })}
              style={[styles.settingOption, isSelected && styles.settingOptionSelected]}
            >
              <View style={[styles.radioIndicator, isSelected && styles.radioIndicatorSelected]} />
              <View style={styles.optionTextGroup}>
                <Text style={[styles.settingOptionText, isSelected && styles.settingOptionTextSelected]}>
                  {option.label}
                </Text>
                <Text style={styles.settingOptionDescription}>{option.description}</Text>
              </View>
            </Pressable>
          );
        })}
      </View>

      <SettingToggle
        description="Dein ungefährer Bereich darf später auf der Karte erscheinen."
        label="isMapVisible"
        onToggle={(isMapVisible) => updateUserSetting({ isMapVisible })}
        value={user.isMapVisible}
      />
      <SettingToggle
        description="Öffentliche Ansichten nutzen keinen direkt erkennbaren Profilnamen."
        label="isAnonymousProfile"
        onToggle={(isAnonymousProfile) => updateUserSetting({ isAnonymousProfile })}
        value={user.isAnonymousProfile}
      />

      <Text style={styles.label}>city</Text>
      <TextInput
        onChangeText={updateTextSetting('city')}
        placeholder="Berlin"
        placeholderTextColor={colors.mutedText}
        style={styles.input}
        value={user.city}
      />

      <Text style={styles.label}>area</Text>
      <TextInput
        onChangeText={updateTextSetting('area')}
        placeholder="z. B. Kreuzberg"
        placeholderTextColor={colors.mutedText}
        style={styles.input}
        value={user.area}
      />

      <Text style={styles.label}>monthlyProfitGoal</Text>
      <TextInput
        keyboardType="numeric"
        onChangeText={updateMonthlyProfitGoal}
        placeholder="Monatliches Gewinnziel in €"
        placeholderTextColor={colors.mutedText}
        style={styles.input}
        value={monthlyProfitGoalInput}
      />
    </View>
  );
}

function SettingToggle({
  description,
  label,
  onToggle,
  value,
}: {
  description: string;
  label: string;
  onToggle: (value: boolean) => void;
  value: boolean;
}) {
  return (
    <Pressable
      accessibilityRole="switch"
      accessibilityState={{ checked: value }}
      onPress={() => onToggle(!value)}
      style={[styles.settingOption, value && styles.settingOptionSelected]}
    >
      <View style={[styles.toggleTrack, value && styles.toggleTrackActive]}>
        <View style={[styles.toggleThumb, value && styles.toggleThumbActive]} />
      </View>
      <View style={styles.optionTextGroup}>
        <Text style={[styles.settingOptionText, value && styles.settingOptionTextSelected]}>{label}</Text>
        <Text style={styles.settingOptionDescription}>{description}</Text>
      </View>
    </Pressable>
  );
}

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.metricCard}>
      <Text style={styles.metricLabel}>{label}</Text>
      <Text style={styles.metricValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    backgroundColor: colors.border,
    borderRadius: radii.md,
    color: colors.primaryText,
    fontSize: 12,
    fontWeight: '800',
    overflow: 'hidden',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  button: {
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: radii.md,
    padding: spacing.md,
  },
  buttonText: {
    color: colors.background,
    fontSize: 16,
    fontWeight: '800',
  },
  cardTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '800',
  },
  content: {
    gap: spacing.lg,
    padding: spacing.lg,
  },
  goalCard: {
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderRadius: radii.lg,
    borderWidth: 1,
    gap: spacing.md,
    padding: spacing.lg,
  },
  emptyState: {
    backgroundColor: colors.background,
    borderColor: colors.border,
    borderRadius: radii.md,
    borderWidth: 1,
    gap: spacing.md,
    padding: spacing.md,
  },
  emptyStateTitle: {
    color: colors.text,
    fontSize: 20,
    fontWeight: '900',
  },
  header: {
    gap: spacing.sm,
  },
  hustleGoal: {
    color: colors.primary,
    fontSize: 15,
    fontWeight: '900',
  },
  hustleList: {
    gap: spacing.sm,
  },
  hustleListItem: {
    alignItems: 'center',
    backgroundColor: colors.background,
    borderColor: colors.border,
    borderRadius: radii.md,
    borderWidth: 1,
    flexDirection: 'row',
    gap: spacing.md,
    justifyContent: 'space-between',
    padding: spacing.md,
  },
  hustleTitle: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '800',
  },
  input: {
    backgroundColor: colors.background,
    borderColor: colors.border,
    borderRadius: radii.md,
    borderWidth: 1,
    color: colors.text,
    fontSize: 16,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
  },
  label: {
    color: colors.primaryText,
    fontSize: 14,
    fontWeight: '700',
  },
  optionStack: {
    gap: spacing.sm,
  },
  optionTextGroup: {
    flex: 1,
    gap: spacing.xs,
  },

  hustlesCard: {
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderRadius: radii.lg,
    borderWidth: 1,
    gap: spacing.md,
    padding: spacing.lg,
  },
  kicker: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  metricCard: {
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderRadius: radii.lg,
    borderWidth: 1,
    flex: 1,
    gap: spacing.sm,
    minWidth: 145,
    padding: spacing.md,
  },
  metricGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  metricLabel: {
    color: colors.mutedText,
    fontSize: 13,
    fontWeight: '700',
  },
  metricValue: {
    color: colors.text,
    fontSize: 24,
    fontWeight: '900',
  },
  muted: {
    color: colors.mutedText,
    fontSize: 15,
    lineHeight: 22,
  },
  profileBio: {
    color: colors.mutedText,
    fontSize: 14,
    lineHeight: 20,
  },
  profileCard: {
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderRadius: radii.lg,
    borderWidth: 1,
    gap: spacing.xs,
    padding: spacing.md,
  },
  profileMeta: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: '800',
  },
  profileOffering: {
    color: colors.text,
    fontSize: 17,
    fontWeight: '800',
  },
  progressFill: {
    backgroundColor: colors.primary,
    borderRadius: radii.md,
    height: '100%',
  },
  progressTrack: {
    backgroundColor: colors.background,
    borderRadius: radii.md,
    height: 12,
    overflow: 'hidden',
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
  progressValue: {
    color: colors.primary,
    fontSize: 18,
    fontWeight: '900',
  },
  rowBetween: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  safeArea: {
    backgroundColor: colors.background,
    flex: 1,
  },

  sectionTitleGroup: {
    flex: 1,
    gap: spacing.xs,
  },
  settingOption: {
    alignItems: 'center',
    backgroundColor: colors.background,
    borderColor: colors.border,
    borderRadius: radii.md,
    borderWidth: 1,
    flexDirection: 'row',
    gap: spacing.sm,
    padding: spacing.md,
  },
  settingOptionDescription: {
    color: colors.mutedText,
    fontSize: 13,
    lineHeight: 18,
  },
  settingOptionSelected: {
    borderColor: colors.primary,
  },
  settingOptionText: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '700',
  },
  settingOptionTextSelected: {
    color: colors.primaryText,
  },
  settingsCard: {
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderRadius: radii.lg,
    borderWidth: 1,
    gap: spacing.md,
    padding: spacing.lg,
  },
  subtitle: {
    color: colors.mutedText,
    fontSize: 16,
    lineHeight: 24,
  },

  toggleThumb: {
    backgroundColor: colors.mutedText,
    borderRadius: 9,
    height: 18,
    width: 18,
  },
  toggleThumbActive: {
    alignSelf: 'flex-end',
    backgroundColor: colors.background,
  },
  toggleTrack: {
    backgroundColor: colors.border,
    borderRadius: 12,
    justifyContent: 'center',
    padding: 3,
    width: 44,
  },
  toggleTrackActive: {
    backgroundColor: colors.primary,
  },
  title: {
    color: colors.text,
    fontSize: 34,
    fontWeight: '900',
  },
});
