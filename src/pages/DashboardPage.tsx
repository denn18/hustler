import { View } from 'react-native';
import { AppText } from '@/components/AppText';
import { Card } from '@/components/Card';
import { PrimaryButton } from '@/components/PrimaryButton';
import { SectionHeader } from '@/components/SectionHeader';
import { profile } from '@/db/mockData';
import { progress, profitOf } from '@/logic/metrics';
import { getDashboardData } from '@/services/hustleService';
import { spacing } from '@/design/theme';

export function DashboardPage() {
  const data = getDashboardData();
  const goalProgress = progress(profile.monthlyGoal, data.month.profit);
  return (
    <View style={{ gap: spacing.md }}>
      <SectionHeader title="Dashboard" caption={`${profile.username} · ${profile.city}-${profile.district}`} />
      <Card style={{ gap: spacing.sm }}>
        <AppText muted>Monatsziel</AppText>
        <AppText size={34} weight="900">{goalProgress}%</AppText>
        <AppText>{euro(data.month.profit)} / {euro(profile.monthlyGoal)}</AppText>
      </Card>
      <View style={{ flexDirection: 'row', gap: spacing.sm }}>
        <Metric label="Heute" value={euro(data.today.profit)} />
        <Metric label="Ø Stundenlohn" value={`${Math.round(data.month.hourlyRate)} €/h`} />
      </View>
      <PrimaryButton label="+ Quick Add Einnahme" />
      <SectionHeader title="Meine Hustles" />
      {data.hustleStats.map(({ hustle, profit }) => (
        <Card key={hustle.id} style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md }}>
          <AppText size={28} style={{ color: hustle.color }}>{iconEmoji[hustle.category] ?? '💼'}</AppText>
          <View style={{ flex: 1 }}>
            <AppText weight="800">{hustle.name}</AppText>
            <AppText muted>{hustle.isPublic ? 'Öffentliches Angebot aktiv' : 'Privat'}</AppText>
          </View>
          <AppText weight="900">{euro(profit)}</AppText>
        </Card>
      ))}
      <SectionHeader title="Letzte Einträge" />
      {data.entries.slice(0, 3).map((entry) => (
        <Card key={entry.id}>
          <AppText weight="800">{entry.type === 'income' ? 'Einnahme' : 'Ausgabe'} · {euro(profitOf(entry))}</AppText>
          <AppText muted>{entry.date} · {entry.durationMinutes} Minuten</AppText>
        </Card>
      ))}
    </View>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return <Card style={{ flex: 1 }}><AppText muted>{label}</AppText><AppText size={24} weight="900">{value}</AppText></Card>;
}

const euro = (value: number) => `${Math.round(value).toLocaleString('de-DE')} €`;

const iconEmoji: Record<string, string> = { reselling: '📦', education: '🎓', local: '🌱', online: '💻', delivery: '🚗', creative: '📸', craft: '🛠️', other: '💼' };
