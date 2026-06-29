import { useMemo, useState } from 'react';
import { Pressable, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TextInput, View } from 'react-native';

import { colors, radii, spacing } from '../design/theme';
import type { HustleVisibility, UserProfile } from '../models/hustler';
import { createHustle, type CreateHustleInput } from '../services/hustleService';

type CreateHustlePageProps = {
  onCancel: () => void;
  onCreated: (user: UserProfile) => void;
  user: UserProfile;
};

const visibilityOptions: Array<{ label: string; value: HustleVisibility }> = [
  { label: 'Privat', value: 'private' },
  { label: 'Profil', value: 'publicProfile' },
  { label: 'Angebot', value: 'publicOffer' },
];

export function CreateHustlePage({ onCancel, onCreated, user }: CreateHustlePageProps) {
  const [form, setForm] = useState<CreateHustleInput>({ category: '', name: '', visibility: 'private' });
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
  const [targetMonthlyProfitInput, setTargetMonthlyProfitInput] = useState('');
  const [error, setError] = useState<string | null>(null);

  const canSubmit = useMemo(() => form.name.trim().length > 0 && form.category.trim().length > 0, [form]);

  function updateTextField(field: keyof CreateHustleInput) {
    return (value: string) => {
      setError(null);
      setForm((currentForm) => ({ ...currentForm, [field]: value }));
    };
  }

  function updateTargetMonthlyProfit(value: string) {
    setTargetMonthlyProfitInput(value);
    const parsedTargetMonthlyProfit = Number(value.replace(',', '.'));
    setForm((currentForm) => ({
      ...currentForm,
      targetMonthlyProfit: Number.isFinite(parsedTargetMonthlyProfit) ? parsedTargetMonthlyProfit : undefined,
    }));
  }

  function submit() {
    if (!canSubmit) {
      setError('Bitte fülle Name und Kategorie aus.');
      return;
    }

    try {
      onCreated(createHustle(user, form));
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Der Hustle konnte nicht erstellt werden.');
    }
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.kicker}>Neuer Hustle</Text>
          <Text style={styles.title}>Schnellstart für deinen nächsten Side Hustle</Text>
          <Text style={styles.subtitle}>Starte mit zwei Pflichtfeldern. Details kannst du direkt oder später ergänzen.</Text>
        </View>

        <View style={styles.formCard}>
          <Text style={styles.label}>Name *</Text>
          <TextInput
            onChangeText={updateTextField('name')}
            placeholder="z. B. Wochenend-Fotoshootings"
            placeholderTextColor={colors.mutedText}
            style={styles.input}
            value={form.name}
          />

          <Text style={styles.label}>Kategorie *</Text>
          <TextInput
            onChangeText={updateTextField('category')}
            placeholder="z. B. Kreativ, Verkauf, Service"
            placeholderTextColor={colors.mutedText}
            style={styles.input}
            value={form.category}
          />

          <Pressable onPress={() => setIsAdvancedOpen((isOpen) => !isOpen)} style={styles.advancedToggle}>
            <Text style={styles.advancedToggleText}>Optionale Felder</Text>
            <Text style={styles.advancedToggleText}>{isAdvancedOpen ? '−' : '+'}</Text>
          </Pressable>

          {isAdvancedOpen ? (
            <View style={styles.advancedSection}>
              <Text style={styles.label}>Icon</Text>
              <TextInput onChangeText={updateTextField('icon')} placeholder="💼" placeholderTextColor={colors.mutedText} style={styles.input} value={form.icon} />

              <Text style={styles.label}>Farbe</Text>
              <TextInput onChangeText={updateTextField('color')} placeholder="#38BDF8" placeholderTextColor={colors.mutedText} style={styles.input} value={form.color} />

              <Text style={styles.label}>Beschreibung</Text>
              <TextInput multiline onChangeText={updateTextField('description')} placeholder="Worum geht es?" placeholderTextColor={colors.mutedText} style={[styles.input, styles.textArea]} value={form.description} />

              <Text style={styles.label}>Sichtbarkeit</Text>
              <View style={styles.visibilityRow}>
                {visibilityOptions.map((option) => {
                  const isSelected = form.visibility === option.value;

                  return (
                    <Pressable
                      accessibilityRole="radio"
                      accessibilityState={{ selected: isSelected }}
                      key={option.value}
                      onPress={() => setForm((currentForm) => ({ ...currentForm, visibility: option.value }))}
                      style={[styles.visibilityOption, isSelected && styles.visibilityOptionSelected]}
                    >
                      <Text style={[styles.visibilityText, isSelected && styles.visibilityTextSelected]}>{option.label}</Text>
                    </Pressable>
                  );
                })}
              </View>

              <Text style={styles.label}>Angebotstext</Text>
              <TextInput multiline onChangeText={updateTextField('offerDescription')} placeholder="Was bietest du an?" placeholderTextColor={colors.mutedText} style={[styles.input, styles.textArea]} value={form.offerDescription} />

              <Text style={styles.label}>Ziel pro Hustle</Text>
              <TextInput keyboardType="numeric" onChangeText={updateTargetMonthlyProfit} placeholder="Monatliches Ziel in €" placeholderTextColor={colors.mutedText} style={styles.input} value={targetMonthlyProfitInput} />

              <Text style={styles.label}>Kunde</Text>
              <TextInput onChangeText={updateTextField('customer')} placeholder="Erster Wunschkunde" placeholderTextColor={colors.mutedText} style={styles.input} value={form.customer} />

              <Text style={styles.label}>Notizen</Text>
              <TextInput multiline onChangeText={updateTextField('notes')} placeholder="Ideen, To-dos, Links ..." placeholderTextColor={colors.mutedText} style={[styles.input, styles.textArea]} value={form.notes} />
            </View>
          ) : null}

          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          <View style={styles.actions}>
            <Pressable onPress={onCancel} style={[styles.button, styles.secondaryButton]}>
              <Text style={[styles.buttonText, styles.secondaryButtonText]}>Abbrechen</Text>
            </Pressable>
            <Pressable onPress={submit} style={[styles.button, !canSubmit && styles.disabledButton]}>
              <Text style={styles.buttonText}>Hustle erstellen</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  actions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  advancedSection: {
    gap: spacing.md,
  },
  advancedToggle: {
    alignItems: 'center',
    backgroundColor: colors.background,
    borderColor: colors.border,
    borderRadius: radii.md,
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: spacing.md,
  },
  advancedToggleText: {
    color: colors.primaryText,
    fontSize: 16,
    fontWeight: '800',
  },
  button: {
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: radii.md,
    flex: 1,
    minWidth: 160,
    padding: spacing.md,
  },
  buttonText: {
    color: colors.background,
    fontSize: 16,
    fontWeight: '800',
  },
  content: {
    gap: spacing.lg,
    padding: spacing.lg,
  },
  disabledButton: {
    opacity: 0.5,
  },
  errorText: {
    color: '#FCA5A5',
    fontSize: 14,
    fontWeight: '700',
  },
  formCard: {
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderRadius: radii.lg,
    borderWidth: 1,
    gap: spacing.md,
    padding: spacing.lg,
  },
  header: {
    gap: spacing.sm,
  },
  input: {
    backgroundColor: colors.background,
    borderColor: colors.border,
    borderRadius: radii.md,
    borderWidth: 1,
    color: colors.text,
    fontSize: 16,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
  },
  kicker: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  label: {
    color: colors.primaryText,
    fontSize: 14,
    fontWeight: '700',
  },
  safeArea: {
    backgroundColor: colors.background,
    flex: 1,
  },
  secondaryButton: {
    backgroundColor: colors.border,
  },
  secondaryButtonText: {
    color: colors.text,
  },
  subtitle: {
    color: colors.mutedText,
    fontSize: 16,
    lineHeight: 24,
  },
  textArea: {
    minHeight: 92,
    textAlignVertical: 'top',
  },
  title: {
    color: colors.text,
    fontSize: 34,
    fontWeight: '900',
  },
  visibilityOption: {
    alignItems: 'center',
    backgroundColor: colors.background,
    borderColor: colors.border,
    borderRadius: radii.md,
    borderWidth: 1,
    flex: 1,
    padding: spacing.md,
  },
  visibilityOptionSelected: {
    borderColor: colors.primary,
  },
  visibilityRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  visibilityText: {
    color: colors.mutedText,
    fontSize: 14,
    fontWeight: '800',
  },
  visibilityTextSelected: {
    color: colors.primaryText,
  },
});
