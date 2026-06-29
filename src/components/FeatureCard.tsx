import { StyleSheet, Text, View } from 'react-native';

import { colors, radii, spacing } from '../design/theme';
import type { AppFeature } from '../models/app';

type FeatureCardProps = {
  feature: AppFeature;
};

export function FeatureCard({ feature }: FeatureCardProps) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{feature.title}</Text>
      <Text style={styles.description}>{feature.description}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderRadius: radii.md,
    borderWidth: 1,
    gap: spacing.sm,
    padding: spacing.md,
  },
  description: {
    color: colors.mutedText,
    fontSize: 15,
    lineHeight: 22,
  },
  title: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '700',
  },
});
