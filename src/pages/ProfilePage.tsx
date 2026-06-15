import { View } from 'react-native';
import { AppText } from '@/components/AppText';
import { Card } from '@/components/Card';
import { SectionHeader } from '@/components/SectionHeader';
import { profile, recurringCosts, customers } from '@/db/mockData';
import { spacing } from '@/design/theme';

export function ProfilePage() {
  return (
    <View style={{ gap: spacing.md }}>
      <SectionHeader title="Profil & Einstellungen" caption="Sichtbarkeit, Reports, Blockieren und Melden zentral verwalten." />
      <Card>
        <AppText size={28} weight="900">@{profile.username}</AppText>
        <AppText muted>{profile.city} · {profile.district}</AppText>
      </Card>
      <Setting label="Kartensichtbarkeit" value="Mit Username sichtbar" />
      <Setting label="Einnahmen" value="Nach bewusster Zustimmung sichtbar" />
      <Setting label="Leaderboard" value="Freiwillig/anonym" />
      <Setting label="Chat" value="Nur nach angenommener Kontaktanfrage" />
      <Setting label="Sicherheit" value="Blockieren und Melden aktiviert" />
      <SectionHeader title="Kunden & Fixkosten" />
      <Card><AppText>{customers.length} Kunde · {recurringCosts.length} wiederkehrende Kosten</AppText></Card>
    </View>
  );
}

function Setting({ label, value }: { label: string; value: string }) {
  return <Card><AppText weight="900">{label}</AppText><AppText muted>{value}</AppText></Card>;
}
