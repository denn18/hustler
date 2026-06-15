import { ReactNode } from 'react';
import { Text, TextStyle } from 'react-native';
import { useAppTheme } from '../design/useAppTheme';

interface Props { children: ReactNode; muted?: boolean; size?: number; weight?: TextStyle['fontWeight']; style?: TextStyle; }

export function AppText({ children, muted, size = 16, weight = '500', style }: Props) {
  const theme = useAppTheme();
  return <Text style={[{ color: muted ? theme.textMuted : theme.text, fontSize: size, fontWeight: weight }, style]}>{children}</Text>;
}
