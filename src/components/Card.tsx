import { ReactNode } from 'react';
import { View, ViewStyle } from 'react-native';
import { radius, spacing } from '@/design/theme';
import { useAppTheme } from '@/design/useAppTheme';

export function Card({ children, style }: { children: ReactNode; style?: ViewStyle }) {
  const theme = useAppTheme();
  return <View style={[{ backgroundColor: theme.surface, borderColor: theme.border, borderRadius: radius.lg, borderWidth: 1, padding: spacing.md }, style]}>{children}</View>;
}
