import { Pressable, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, View } from 'react-native';

import { colors, radii, spacing } from '../design/theme';
import type { UserProfile } from '../models/hustler';
import { getPublicDisplayName } from '../services/authService';
import { getDashboardSummary } from '../services/dashboardService';

type DashboardPageProps = {
  user: UserProfile;
};

const formatEuro = (value: number): string => `€${Math.round(value).toLocaleString('de-DE')}`;

export function DashboardPage({ user }: DashboardPageProps) {
  const summary = getDashboardSummary(user);
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

        <View style={styles.hustlesCard}>
          <View style={styles.rowBetween}>
            <Text style={styles.cardTitle}>Meine Hustles</Text>
            <Text style={styles.badge}>{summary.hasHustles ? 'Aktiv' : 'Neu'}</Text>
          </View>
          <Text style={styles.muted}>
            {summary.hasHustles
              ? 'Füge eine neue Einnahme hinzu, um deinen Fortschritt aktuell zu halten.'
              : 'Lege deinen ersten Hustle an und tracke Einnahmen direkt im Dashboard.'}
          </Text>
          <Pressable style={styles.button}>
            <Text style={styles.buttonText}>{summary.hasHustles ? '+ Einnahme' : 'Ersten Hustle erstellen'}</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
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
  header: {
    gap: spacing.sm,
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
  subtitle: {
    color: colors.mutedText,
    fontSize: 16,
    lineHeight: 24,
  },
  title: {
    color: colors.text,
    fontSize: 34,
    fontWeight: '900',
  },
});
