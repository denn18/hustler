import type { PropsWithChildren } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { colors, spacing, typography } from '../theme';

type SectionCardProps = PropsWithChildren<{
  title: string;
}>;

export function SectionCard({ children, title }: SectionCardProps) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{title}</Text>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: spacing.lg,
    borderRadius: 24,
    backgroundColor: colors.card,
    padding: spacing.xl,
  },
  title: {
    color: colors.textOnCard,
    fontSize: typography.sizes.title,
    fontWeight: typography.weights.black,
  },
});
