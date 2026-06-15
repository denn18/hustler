import { Pressable, PressableProps, PressableStateCallbackType, StyleProp, ViewStyle } from 'react-native';
import { AppText } from './AppText';
import { radius, spacing } from '../design/theme';
import { useAppTheme } from '../design/useAppTheme';

interface Props extends PressableProps { label: string; variant?: 'primary' | 'muted'; }

export function PrimaryButton({ label, variant = 'primary', style, ...props }: Props) {
  const theme = useAppTheme();
  const backgroundColor = variant === 'primary' ? theme.primary : theme.surfaceMuted;
  const baseStyle: ViewStyle = { alignItems: 'center', backgroundColor, borderRadius: radius.pill, paddingHorizontal: spacing.lg, paddingVertical: spacing.md };
  const pressableStyle = (state: PressableStateCallbackType): StyleProp<ViewStyle> => [
    baseStyle,
    typeof style === 'function' ? style(state) : style,
  ];

  return (
    <Pressable {...props} style={pressableStyle}>
      <AppText weight="700" style={{ color: variant === 'primary' ? '#FFFFFF' : theme.text }}>{label}</AppText>
    </Pressable>
  );
}
