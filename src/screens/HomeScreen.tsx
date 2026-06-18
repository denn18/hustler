import { useMemo } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { SectionCard } from '../components/SectionCard';
import { TaskList } from '../components/TaskList';
import { dailyTasks, getTotalMinutes } from '../lib/tasks';
import { colors, spacing, typography } from '../theme';

export function HomeScreen() {
  const totalMinutes = useMemo(() => getTotalMinutes(dailyTasks), []);

  return (
    <ScrollView contentContainerStyle={styles.content}>
      <View style={styles.hero}>
        <Text style={styles.kicker}>Hustler OS</Text>
        <Text style={styles.heading}>Eine stabile Expo-Go-Basis.</Text>
        <Text style={styles.subtitle}>
          Minimaler Einstiegspunkt, klare TypeScript-Struktur und keine nativen Zusatzmodule.
        </Text>
      </View>

      <SectionCard title="Heute erledigen">
        <TaskList tasks={dailyTasks} />
      </SectionCard>

      <View style={styles.summary}>
        <Text style={styles.summaryValue}>{totalMinutes}</Text>
        <Text style={styles.summaryLabel}>Minuten fokussierte Arbeit sind für heute geplant.</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: spacing.xl,
    padding: spacing.xl,
    paddingBottom: spacing.xxl,
  },
  hero: {
    backgroundColor: colors.surface,
    borderRadius: 28,
    gap: spacing.md,
    padding: spacing.xl,
  },
  kicker: {
    color: colors.accent,
    fontSize: typography.sizes.caption,
    fontWeight: typography.weights.black,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  heading: {
    color: colors.textPrimary,
    fontSize: typography.sizes.heading,
    fontWeight: typography.weights.black,
    lineHeight: 40,
  },
  subtitle: {
    color: colors.textSecondary,
    fontSize: typography.sizes.body,
    lineHeight: 24,
  },
  summary: {
    backgroundColor: colors.surfaceMuted,
    borderRadius: 22,
    flexDirection: 'row',
    gap: spacing.lg,
    padding: spacing.xl,
  },
  summaryValue: {
    color: colors.success,
    fontSize: typography.sizes.heading,
    fontWeight: typography.weights.black,
  },
  summaryLabel: {
    color: colors.textSecondary,
    flex: 1,
    fontSize: typography.sizes.body,
    lineHeight: 24,
  },
});
