import { useMemo, useState } from 'react';
import { Pressable, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TextInput, View } from 'react-native';

import { colors, radii, spacing } from '../design/theme';
import { getHustleDisplayName, type HustleEntryType, type PaymentStatus, type UserProfile } from '../models/hustler';
import { calculateEntryHourlyRate, createEntry, type CreateEntryInput } from '../services/entryService';

type CreateEntryPageProps = {
  onCancel: () => void;
  onCreated: (user: UserProfile) => void;
  user: UserProfile;
};

type EntryForm = Omit<CreateEntryInput, 'expenseAmount' | 'hoursWorked' | 'incomeAmount'> & {
  expenseAmount: string;
  hoursWorked: string;
  incomeAmount: string;
};

const paymentStatusOptions: Array<{ label: string; value: PaymentStatus }> = [
  { label: 'Bezahlt', value: 'paid' },
  { label: 'Offen', value: 'open' },
  { label: 'Überfällig', value: 'overdue' },
];

const entryTypeOptions: Array<{ label: string; value: HustleEntryType }> = [
  { label: 'Einnahme erfassen', value: 'income' },
  { label: 'Ausgabe erfassen', value: 'expense' },
];

const parseNumber = (value: string): number => Number(value.replace(',', '.'));
const formatEuro = (value: number): string => `€${value.toLocaleString('de-DE', { maximumFractionDigits: 2 })}`;

export function CreateEntryPage({ onCancel, onCreated, user }: CreateEntryPageProps) {
  const activeHustles = useMemo(() => (user.hustles ?? []).filter((hustle) => hustle.isActive), [user.hustles]);
  const [form, setForm] = useState<EntryForm>({
    expenseAmount: '',
    hoursWorked: '',
    hustleId: activeHustles[0]?.id ?? '',
    paymentStatus: 'paid',
    incomeAmount: '',
    type: 'income',
  });
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const previewEntry = {
    expenseAmount: parseNumber(form.expenseAmount) || 0,
    hoursWorked: parseNumber(form.hoursWorked) || 0,
    incomeAmount: form.type === 'expense' ? 0 : parseNumber(form.incomeAmount) || 0,
    type: form.type,
  };
  const profit = previewEntry.type === 'expense' ? -previewEntry.expenseAmount : previewEntry.incomeAmount - previewEntry.expenseAmount;
  const hourlyRate = calculateEntryHourlyRate(previewEntry);
  const canSubmit = form.hustleId.length > 0 && previewEntry.incomeAmount >= 0 && previewEntry.expenseAmount >= 0 && previewEntry.hoursWorked > 0 && (form.type === 'income' ? previewEntry.incomeAmount > 0 : previewEntry.expenseAmount > 0);

  function updateTextField(field: keyof EntryForm) {
    return (value: string) => {
      setError(null);
      setForm((currentForm) => ({ ...currentForm, [field]: value }));
    };
  }

  function submit() {
    if (!canSubmit) {
      setError('Bitte wähle einen Hustle aus und fülle Betrag und Zeit korrekt aus.');
      return;
    }

    try {
      onCreated(createEntry(user, {
        ...form,
        expenseAmount: parseNumber(form.expenseAmount),
        hoursWorked: parseNumber(form.hoursWorked),
        materialCosts: form.materialCosts,
        platformFees: form.platformFees,
        incomeAmount: form.type === 'expense' ? 0 : parseNumber(form.incomeAmount),
        travelCosts: form.travelCosts,
      }));
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Der Eintrag konnte nicht gespeichert werden.');
    }
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.kicker}>{form.type === 'income' ? '+ Einnahme' : '− Ausgabe'}</Text>
          <Text style={styles.title}>{form.type === 'income' ? 'Einnahme erfassen' : 'Ausgabe erfassen'}</Text>
          <Text style={styles.subtitle}>{form.type === 'income' ? 'Wähle Hustle, Einnahme, Kosten und Zeit. Details kannst du optional direkt ergänzen.' : 'Wähle Hustle, Ausgabenbetrag und Zeit. Grund und Kategorie kannst du optional direkt ergänzen.'}</Text>
        </View>

        <View style={styles.formCard}>
          <Text style={styles.label}>Art *</Text>
          <View style={styles.optionRow}>{entryTypeOptions.map((option) => <Pressable accessibilityRole="radio" accessibilityState={{ selected: form.type === option.value }} key={option.value} onPress={() => setForm((currentForm) => ({ ...currentForm, type: option.value, incomeAmount: option.value === 'expense' ? '' : currentForm.incomeAmount }))} style={[styles.option, form.type === option.value && styles.optionSelected]}><Text style={[styles.optionText, form.type === option.value && styles.optionTextSelected]}>{option.label}</Text></Pressable>)}</View>

          <Text style={styles.label}>Hustle *</Text>
          <View style={styles.optionRow}>
            {activeHustles.map((hustle) => {
              const isSelected = form.hustleId === hustle.id;

              return (
                <Pressable
                  accessibilityRole="radio"
                  accessibilityState={{ selected: isSelected }}
                  key={hustle.id}
                  onPress={() => setForm((currentForm) => ({ ...currentForm, hustleId: hustle.id }))}
                  style={[styles.option, isSelected && styles.optionSelected]}
                >
                  <Text style={[styles.optionText, isSelected && styles.optionTextSelected]}>{getHustleDisplayName(hustle)}</Text>
                </Pressable>
              );
            })}
          </View>

          {form.type === 'income' ? (
            <>
              <Text style={styles.label}>Einnahme *</Text>
              <TextInput keyboardType="numeric" onChangeText={updateTextField('incomeAmount')} placeholder="0,00" placeholderTextColor={colors.mutedText} style={styles.input} value={form.incomeAmount} />
            </>
          ) : null}

          <Text style={styles.label}>{form.type === 'income' ? 'Kosten *' : 'Ausgabenbetrag *'}</Text>
          <TextInput keyboardType="numeric" onChangeText={updateTextField('expenseAmount')} placeholder="0,00" placeholderTextColor={colors.mutedText} style={styles.input} value={form.expenseAmount} />

          <Text style={styles.label}>Zeit in Stunden *</Text>
          <TextInput keyboardType="numeric" onChangeText={updateTextField('hoursWorked')} placeholder="z. B. 2,5" placeholderTextColor={colors.mutedText} style={styles.input} value={form.hoursWorked} />

          <View style={styles.previewCard}>
            <Text style={styles.previewLabel}>Gewinn</Text>
            <Text style={styles.previewValue}>{formatEuro(profit)}</Text>
            <Text style={styles.previewLabel}>Stundenlohn</Text>
            <Text style={styles.previewValue}>{formatEuro(hourlyRate)}/h</Text>
          </View>

          <Pressable onPress={() => setIsAdvancedOpen((isOpen) => !isOpen)} style={styles.advancedToggle}>
            <Text style={styles.advancedToggleText}>Details später oder jetzt ergänzen</Text>
            <Text style={styles.advancedToggleText}>{isAdvancedOpen ? '−' : '+'}</Text>
          </Pressable>

          {isAdvancedOpen ? (
            <View style={styles.advancedSection}>
              <Text style={styles.label}>Notiz</Text>
              <TextInput multiline onChangeText={updateTextField('note')} placeholder="Was ist passiert?" placeholderTextColor={colors.mutedText} style={[styles.input, styles.textArea]} value={form.note} />
              <Text style={styles.label}>Materialkosten</Text>
              <TextInput keyboardType="numeric" onChangeText={(value) => setForm((currentForm) => ({ ...currentForm, materialCosts: parseNumber(value) || undefined }))} placeholder="0,00" placeholderTextColor={colors.mutedText} style={styles.input} />
              <Text style={styles.label}>Fahrtkosten</Text>
              <TextInput keyboardType="numeric" onChangeText={(value) => setForm((currentForm) => ({ ...currentForm, travelCosts: parseNumber(value) || undefined }))} placeholder="0,00" placeholderTextColor={colors.mutedText} style={styles.input} />
              <Text style={styles.label}>Plattformgebühren</Text>
              <TextInput keyboardType="numeric" onChangeText={(value) => setForm((currentForm) => ({ ...currentForm, platformFees: parseNumber(value) || undefined }))} placeholder="0,00" placeholderTextColor={colors.mutedText} style={styles.input} />
              <Text style={styles.label}>Kunde</Text>
              <TextInput onChangeText={updateTextField('customer')} placeholder="Name oder Firma" placeholderTextColor={colors.mutedText} style={styles.input} value={form.customer} />
              <Text style={styles.label}>Datum</Text>
              <TextInput onChangeText={updateTextField('date')} placeholder="YYYY-MM-DD" placeholderTextColor={colors.mutedText} style={styles.input} value={form.date} />
              <Text style={styles.label}>Uhrzeit</Text>
              <TextInput onChangeText={updateTextField('time')} placeholder="HH:MM" placeholderTextColor={colors.mutedText} style={styles.input} value={form.time} />
              <Text style={styles.label}>Zahlungsstatus</Text>
              <View style={styles.optionRow}>{paymentStatusOptions.map((option) => <Pressable key={option.value} onPress={() => setForm((currentForm) => ({ ...currentForm, paymentStatus: option.value }))} style={[styles.option, form.paymentStatus === option.value && styles.optionSelected]}><Text style={[styles.optionText, form.paymentStatus === option.value && styles.optionTextSelected]}>{option.label}</Text></Pressable>)}</View>
              <Text style={styles.label}>Ausgabekategorie</Text>
              <TextInput onChangeText={updateTextField('expenseCategory')} placeholder="z. B. Material, Fahrt, Tools" placeholderTextColor={colors.mutedText} style={styles.input} value={form.expenseCategory} />
              <Text style={styles.label}>Grund</Text>
              <TextInput multiline onChangeText={updateTextField('reason')} placeholder="Warum ist die Ausgabe angefallen?" placeholderTextColor={colors.mutedText} style={[styles.input, styles.textArea]} value={form.reason} />
            </View>
          ) : null}

          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          <View style={styles.actions}>
            <Pressable onPress={onCancel} style={[styles.button, styles.secondaryButton]}><Text style={[styles.buttonText, styles.secondaryButtonText]}>Abbrechen</Text></Pressable>
            <Pressable onPress={submit} style={[styles.button, !canSubmit && styles.disabledButton]}><Text style={styles.buttonText}>Speichern</Text></Pressable>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  actions: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md },
  advancedSection: { gap: spacing.md },
  advancedToggle: { alignItems: 'center', backgroundColor: colors.background, borderColor: colors.border, borderRadius: radii.md, borderWidth: 1, flexDirection: 'row', justifyContent: 'space-between', padding: spacing.md },
  advancedToggleText: { color: colors.primaryText, fontSize: 16, fontWeight: '800' },
  button: { alignItems: 'center', backgroundColor: colors.primary, borderRadius: radii.md, flex: 1, minWidth: 150, padding: spacing.md },
  buttonText: { color: colors.background, fontSize: 16, fontWeight: '800' },
  content: { gap: spacing.lg, padding: spacing.lg },
  disabledButton: { opacity: 0.5 },
  errorText: { color: '#FCA5A5', fontSize: 14, fontWeight: '700' },
  formCard: { backgroundColor: colors.card, borderColor: colors.border, borderRadius: radii.lg, borderWidth: 1, gap: spacing.md, padding: spacing.lg },
  header: { gap: spacing.sm },
  input: { backgroundColor: colors.background, borderColor: colors.border, borderRadius: radii.md, borderWidth: 1, color: colors.text, fontSize: 16, paddingHorizontal: spacing.md, paddingVertical: spacing.md },
  kicker: { color: colors.primary, fontSize: 14, fontWeight: '700', letterSpacing: 1, textTransform: 'uppercase' },
  label: { color: colors.primaryText, fontSize: 14, fontWeight: '700' },
  option: { backgroundColor: colors.background, borderColor: colors.border, borderRadius: radii.md, borderWidth: 1, padding: spacing.md },
  optionRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  optionSelected: { borderColor: colors.primary },
  optionText: { color: colors.mutedText, fontSize: 14, fontWeight: '800' },
  optionTextSelected: { color: colors.primaryText },
  previewCard: { backgroundColor: colors.background, borderColor: colors.border, borderRadius: radii.md, borderWidth: 1, gap: spacing.xs, padding: spacing.md },
  previewLabel: { color: colors.mutedText, fontSize: 13, fontWeight: '700' },
  previewValue: { color: colors.text, fontSize: 24, fontWeight: '900' },
  safeArea: { backgroundColor: colors.background, flex: 1 },
  secondaryButton: { backgroundColor: colors.border },
  secondaryButtonText: { color: colors.text },
  subtitle: { color: colors.mutedText, fontSize: 16, lineHeight: 24 },
  textArea: { minHeight: 92, textAlignVertical: 'top' },
  title: { color: colors.text, fontSize: 34, fontWeight: '900' },
});
