import { View } from 'react-native';
import { AppText } from '@/components/AppText';
import { Card } from '@/components/Card';
import { SectionHeader } from '@/components/SectionHeader';
import { getDashboardData } from '@/services/hustleService';
import { spacing } from '@/design/theme';

export function InsightsPage() {
  const top = [...getDashboardData().hustleStats].sort((a, b) => b.profit - a.profit);
  return (
    <View style={{ gap: spacing.md }}>
      <SectionHeader title="Analysen" caption="Durchblättern zwischen Gewinn und Wachstum." />
      <Card>
        <AppText muted>Bester Hustle nach Gewinn</AppText>
        <AppText size={28} weight="900">{top[0]?.hustle.name}</AppText>
        <AppText>{Math.round(top[0]?.profit ?? 0)} € Gewinn</AppText>
      </Card>
      <Card>
        <AppText muted>Bester Hustle nach Wachstum</AppText>
        <AppText size={28} weight="900">Nachhilfe</AppText>
        <AppText>+38 % gegenüber letzter Woche</AppText>
      </Card>
      <Card>
        <AppText weight="900">Wochenreport</AppText>
        <AppText muted>Wie Apple Bildschirmzeit: Gewinn, Zeit, Stundenlohn, bester Hustle und Ziel-Fortschritt.</AppText>
      </Card>
    </View>
  );
}
