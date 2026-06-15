import { View } from 'react-native';
import { AppText } from '@/components/AppText';
import { Card } from '@/components/Card';
import { PrimaryButton } from '@/components/PrimaryButton';
import { SectionHeader } from '@/components/SectionHeader';
import { nearbyHustlers } from '@/services/communityService';
import { spacing } from '@/design/theme';

export function CommunityPage() {
  return (
    <View style={{ gap: spacing.md }}>
      <SectionHeader title="Karte & Community" caption="Ungefährer Stadtteil statt exakter Adresse." />
      <Card style={{ height: 180, justifyContent: 'center', gap: spacing.sm }}>
        <AppText size={28} weight="900">Berlin · Neukölln</AppText>
        <AppText muted>Interaktive Expo-Go-freundliche Kartenfläche als Platzhalter für die echte Map.</AppText>
      </Card>
      {nearbyHustlers.map((hustler) => (
        <Card key={hustler.id} style={{ gap: spacing.sm }}>
          <AppText weight="900">{hustler.username}</AppText>
          <AppText muted>{hustler.district} · {hustler.offer}</AppText>
          <AppText muted>{hustler.metric}</AppText>
          <PrimaryButton label="Kontaktanfrage senden" variant="muted" />
        </Card>
      ))}
    </View>
  );
}
