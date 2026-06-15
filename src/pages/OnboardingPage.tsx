import { View } from 'react-native';
import { Card } from '../components/Card';
import { AppText } from '../components/AppText';
import { PrimaryButton } from '../components/PrimaryButton';
import { SectionHeader } from '../components/SectionHeader';
import { spacing } from '../design/theme';

const steps = ['Account', 'Profil', 'Sichtbarkeit', 'Ziel', 'Tutorial'];

export function OnboardingPage({ onFinish }: { onFinish: () => void }) {
  return (
    <View style={{ gap: spacing.md }}>
      <SectionHeader title="Willkommen bei Hustler" caption="5 schnelle Schritte bis zu deinem Dashboard." />
      {steps.map((step, index) => (
        <Card key={step}>
          <AppText weight="800">{index + 1}. {step}</AppText>
          <AppText muted style={{ marginTop: 6 }}>{descriptions[index]}</AppText>
        </Card>
      ))}
      <PrimaryButton label="Demo-Onboarding abschließen" onPress={onFinish} />
    </View>
  );
}

const descriptions = [
  'E-Mail, Benutzername und Passwort ohne Social-Login.',
  'Stadtteil, optional anonymes Profil und keine exakten Standorte.',
  'Einnahmen öffentlich mit Username nur nach bewusster Bestätigung.',
  'Vorschläge wie 500 €, 1.000 €, 2.500 €, 4.000 € oder eigenes Ziel.',
  'Ersten Hustle, Test-Eintrag und Dashboard ansehen — überspringbar.',
];
