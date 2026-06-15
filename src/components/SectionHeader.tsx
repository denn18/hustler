import { View } from 'react-native';
import { AppText } from './AppText';

export function SectionHeader({ title, caption }: { title: string; caption?: string }) {
  return (
    <View style={{ gap: 4 }}>
      <AppText size={22} weight="800">{title}</AppText>
      {caption ? <AppText muted>{caption}</AppText> : null}
    </View>
  );
}
