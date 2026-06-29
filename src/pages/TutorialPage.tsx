import { useMemo, useState } from 'react';
import { Pressable, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, View } from 'react-native';

import { colors, radii, spacing } from '../design/theme';
import type { Hustle, HustleEntry, TutorialStepId, UserProfile } from '../models/hustler';

const tutorialSteps: Array<{ description: string; id: TutorialStepId; title: string }> = [
  {
    id: 'intro',
    title: 'Einführung',
    description: 'In wenigen Schritten richtest du Hustler so ein, dass dein Dashboard sofort sinnvoll startet.',
  },
  {
    id: 'createFirstHustle',
    title: 'Ersten Hustle erstellen',
    description: 'Lege einen Beispiel-Hustle an oder überspringe den Schritt und starte ohne Hustle.',
  },
  {
    id: 'addTestEntry',
    title: 'Optionalen Test-Eintrag machen',
    description: 'Erzeuge eine Beispiel-Einnahme, damit du die Kennzahlen im Dashboard direkt sehen kannst.',
  },
  {
    id: 'viewDashboard',
    title: 'Dashboard ansehen',
    description: 'Schließe das Tutorial ab und springe in deine persönliche Übersicht.',
  },
];

type TutorialPageProps = {
  onComplete: (user: UserProfile) => void;
  user: UserProfile;
};

const createTutorialHustle = (userId: string): Hustle => ({
  id: `tutorial-hustle-${userId}`,
  userId,
  title: 'Mein erster Hustle',
  description: 'Ein lokaler Beispiel-Hustle aus dem Onboarding.',
  targetMonthlyProfit: 1000,
  isActive: true,
  createdAt: new Date().toISOString(),
});

const createTutorialEntry = (hustleId: string): HustleEntry => ({
  id: `tutorial-entry-${hustleId}`,
  hustleId,
  revenue: 120,
  costs: 20,
  hoursWorked: 2,
  note: 'Optionaler Test-Eintrag aus dem Tutorial',
  earnedAt: new Date().toISOString(),
});

export function TutorialPage({ onComplete, user }: TutorialPageProps) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [draftHustles, setDraftHustles] = useState<Hustle[]>(user.hustles ?? []);
  const [draftEntries, setDraftEntries] = useState<HustleEntry[]>(user.hustleEntries ?? []);
  const currentStep = tutorialSteps[currentStepIndex];
  const createdFirstHustle = draftHustles.length > 0;
  const addedTestEntry = draftEntries.length > 0;

  const primaryActionLabel = useMemo(() => {
    if (currentStep.id === 'createFirstHustle') {
      return createdFirstHustle ? 'Weiter' : 'Beispiel-Hustle erstellen';
    }

    if (currentStep.id === 'addTestEntry') {
      return addedTestEntry || !createdFirstHustle ? 'Weiter' : 'Test-Eintrag hinzufügen';
    }

    if (currentStep.id === 'viewDashboard') {
      return 'Tutorial abschließen';
    }

    return 'Loslegen';
  }, [addedTestEntry, createdFirstHustle, currentStep.id]);

  function completeTutorial(hustles: Hustle[] = draftHustles, entries: HustleEntry[] = draftEntries) {
    onComplete({
      ...user,
      hasCompletedTutorial: true,
      tutorialCompletedAt: new Date().toISOString(),
      hustles,
      hustleEntries: entries,
    });
  }

  function goToNextStep() {
    if (currentStepIndex >= tutorialSteps.length - 1) {
      completeTutorial();
      return;
    }

    setCurrentStepIndex((index) => index + 1);
  }

  function handlePrimaryAction() {
    if (currentStep.id === 'createFirstHustle' && !createdFirstHustle) {
      setDraftHustles([createTutorialHustle(user.id)]);
      return;
    }

    if (currentStep.id === 'addTestEntry' && createdFirstHustle && !addedTestEntry) {
      setDraftEntries([createTutorialEntry(draftHustles[0].id)]);
      return;
    }

    goToNextStep();
  }

  function skipFirstHustle() {
    completeTutorial([], []);
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.kicker}>Onboarding</Text>
          <Text style={styles.title}>Starte deinen Hustle-Flow</Text>
          <Text style={styles.subtitle}>Schritt {currentStepIndex + 1} von {tutorialSteps.length}</Text>
        </View>

        <View style={styles.stepList}>
          {tutorialSteps.map((step, index) => {
            const isActive = step.id === currentStep.id;
            const isDone = index < currentStepIndex;

            return (
              <View key={step.id} style={[styles.stepPill, isActive && styles.stepPillActive, isDone && styles.stepPillDone]}>
                <Text style={[styles.stepNumber, (isActive || isDone) && styles.stepNumberActive]}>{index + 1}</Text>
                <Text style={[styles.stepPillText, (isActive || isDone) && styles.stepPillTextActive]}>{step.title}</Text>
              </View>
            );
          })}
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>{currentStep.title}</Text>
          <Text style={styles.muted}>{currentStep.description}</Text>

          {currentStep.id === 'createFirstHustle' ? (
            <View style={styles.previewBox}>
              <Text style={styles.previewTitle}>{createdFirstHustle ? draftHustles[0].title : 'Noch kein Hustle angelegt'}</Text>
              <Text style={styles.muted}>
                {createdFirstHustle
                  ? 'Der Beispiel-Hustle wird lokal in deinen App-State übernommen.'
                  : 'Du kannst diesen Schritt überspringen und dein Dashboard ohne Hustle öffnen.'}
              </Text>
            </View>
          ) : null}

          {currentStep.id === 'addTestEntry' ? (
            <View style={styles.previewBox}>
              <Text style={styles.previewTitle}>{addedTestEntry ? '+100 € Gewinn' : 'Optionaler Test-Eintrag'}</Text>
              <Text style={styles.muted}>
                {createdFirstHustle
                  ? 'Der Eintrag ist optional und dient nur als schneller Dashboard-Test.'
                  : 'Ohne Hustle wird dieser optionale Schritt automatisch übersprungen.'}
              </Text>
            </View>
          ) : null}

          {currentStep.id === 'viewDashboard' ? (
            <View style={styles.previewBox}>
              <Text style={styles.previewTitle}>Bereit fürs Dashboard</Text>
              <Text style={styles.muted}>
                {createdFirstHustle
                  ? 'Dein Hustle-Setup wird gespeichert und das Tutorial künftig nicht mehr angezeigt.'
                  : 'Du gelangst ohne Hustle ins Dashboard und kannst später einen erstellen.'}
              </Text>
            </View>
          ) : null}

          <Pressable style={styles.button} onPress={handlePrimaryAction}>
            <Text style={styles.buttonText}>{primaryActionLabel}</Text>
          </Pressable>

          {currentStep.id === 'createFirstHustle' ? (
            <Pressable style={styles.secondaryButton} onPress={skipFirstHustle}>
              <Text style={styles.secondaryButtonText}>Überspringen und zum Dashboard</Text>
            </Pressable>
          ) : null}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: radii.md,
    padding: spacing.md,
  },
  buttonText: {
    color: colors.background,
    fontSize: 16,
    fontWeight: '800',
  },
  card: {
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderRadius: radii.lg,
    borderWidth: 1,
    gap: spacing.md,
    padding: spacing.lg,
  },
  cardTitle: {
    color: colors.text,
    fontSize: 24,
    fontWeight: '900',
  },
  content: {
    gap: spacing.lg,
    padding: spacing.lg,
  },
  header: {
    gap: spacing.sm,
  },
  kicker: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  muted: {
    color: colors.mutedText,
    fontSize: 15,
    lineHeight: 22,
  },
  previewBox: {
    backgroundColor: colors.background,
    borderColor: colors.border,
    borderRadius: radii.md,
    borderWidth: 1,
    gap: spacing.xs,
    padding: spacing.md,
  },
  previewTitle: {
    color: colors.primaryText,
    fontSize: 17,
    fontWeight: '800',
  },
  safeArea: {
    backgroundColor: colors.background,
    flex: 1,
  },
  secondaryButton: {
    alignItems: 'center',
    borderColor: colors.border,
    borderRadius: radii.md,
    borderWidth: 1,
    padding: spacing.md,
  },
  secondaryButtonText: {
    color: colors.primaryText,
    fontSize: 15,
    fontWeight: '800',
  },
  stepList: {
    gap: spacing.sm,
  },
  stepNumber: {
    color: colors.mutedText,
    fontWeight: '900',
  },
  stepNumberActive: {
    color: colors.background,
  },
  stepPill: {
    alignItems: 'center',
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderRadius: radii.md,
    borderWidth: 1,
    flexDirection: 'row',
    gap: spacing.sm,
    padding: spacing.md,
  },
  stepPillActive: {
    borderColor: colors.primary,
  },
  stepPillDone: {
    backgroundColor: colors.primary,
  },
  stepPillText: {
    color: colors.mutedText,
    fontSize: 15,
    fontWeight: '800',
  },
  stepPillTextActive: {
    color: colors.primaryText,
  },
  subtitle: {
    color: colors.mutedText,
    fontSize: 16,
    lineHeight: 24,
  },
  title: {
    color: colors.text,
    fontSize: 34,
    fontWeight: '900',
  },
});
