import { SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, View } from 'react-native';

import { FeatureCard } from '../components/FeatureCard';
import { colors, radii, spacing } from '../design/theme';
import { createWelcomeMessage } from '../logic/welcome';
import { getStarterFeatures } from '../services/features';

const features = getStarterFeatures();

export function HomePage() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.hero}>
          <Text style={styles.kicker}>Hustler Starter</Text>
          <Text style={styles.title}>{createWelcomeMessage('Hustler')}</Text>
          <Text style={styles.subtitle}>
            Eine schlanke Grundlage ohne Development-Build-Pflicht – optimiert für den ersten Start in Expo Go.
          </Text>
        </View>

        <View style={styles.stack}>
          {features.map((feature) => (
            <FeatureCard feature={feature} key={feature.id} />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: spacing.lg,
    padding: spacing.lg,
  },
  hero: {
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
  safeArea: {
    backgroundColor: colors.background,
    flex: 1,
  },
  stack: {
    gap: spacing.md,
  },
  subtitle: {
    color: colors.mutedText,
    fontSize: 16,
    lineHeight: 24,
  },
  title: {
    color: colors.text,
    fontSize: 32,
    fontWeight: '800',
    lineHeight: 38,
  },
});
