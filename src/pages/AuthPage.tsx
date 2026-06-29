import { useState } from 'react';
import { Pressable, SafeAreaView, StatusBar, StyleSheet, Text, TextInput, View } from 'react-native';

import { colors, radii, spacing } from '../design/theme';
import { signInWithEmail } from '../services/authService';
import type { UserProfile } from '../models/hustler';

type AuthPageProps = {
  onAuthenticate: (user: UserProfile) => void;
};

export function AuthPage({ onAuthenticate }: AuthPageProps) {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [city, setCity] = useState('');
  const [area, setArea] = useState('');
  const [offering, setOffering] = useState('');
  const [bio, setBio] = useState('');

  function handleSubmit() {
    onAuthenticate(signInWithEmail(email, password, { area, bio, city, offering, username }));
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" />
      <View style={styles.content}>
        <View style={styles.hero}>
          <Text style={styles.kicker}>Hustler</Text>
          <Text style={styles.title}>Willkommen zurück</Text>
          <Text style={styles.subtitle}>
            Melde dich an oder registriere dich lokal, um deinen ersten Hustle-Flow zu starten.
          </Text>
        </View>

        <View style={styles.formCard}>
          <Text style={styles.label}>E-Mail</Text>
          <TextInput
            autoCapitalize="none"
            keyboardType="email-address"
            onChangeText={setEmail}
            placeholder="du@beispiel.de"
            placeholderTextColor={colors.mutedText}
            style={styles.input}
            value={email}
          />

          <Text style={styles.label}>Username</Text>
          <TextInput
            autoCapitalize="none"
            onChangeText={setUsername}
            placeholder="dein-hustle-name"
            placeholderTextColor={colors.mutedText}
            style={styles.input}
            value={username}
          />

          <Text style={styles.label}>Passwort</Text>
          <TextInput
            onChangeText={setPassword}
            placeholder="••••••••"
            placeholderTextColor={colors.mutedText}
            secureTextEntry
            style={styles.input}
            value={password}
          />

          <Text style={styles.label}>Stadt</Text>
          <TextInput
            onChangeText={setCity}
            placeholder="Berlin"
            placeholderTextColor={colors.mutedText}
            style={styles.input}
            value={city}
          />

          <Text style={styles.label}>Kiez / Gebiet</Text>
          <TextInput
            onChangeText={setArea}
            placeholder="Kreuzberg"
            placeholderTextColor={colors.mutedText}
            style={styles.input}
            value={area}
          />

          <Text style={styles.label}>Angebot</Text>
          <TextInput
            onChangeText={setOffering}
            placeholder="z. B. Design Sprints"
            placeholderTextColor={colors.mutedText}
            style={styles.input}
            value={offering}
          />

          <Text style={styles.label}>Bio (optional)</Text>
          <TextInput
            multiline
            onChangeText={setBio}
            placeholder="Kurzbeschreibung deines Hustles"
            placeholderTextColor={colors.mutedText}
            style={[styles.input, styles.textArea]}
            value={bio}
          />

          <Pressable style={styles.button} onPress={handleSubmit}>
            <Text style={styles.buttonText}>Einloggen / Registrieren</Text>
          </Pressable>

          <Text style={styles.hint}>
            Auth ist für diesen Prototyp nur lokal gemockt, damit der App-Flow ohne Backend startfähig ist.
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: radii.md,
    marginTop: spacing.sm,
    padding: spacing.md,
  },
  buttonText: {
    color: colors.background,
    fontSize: 16,
    fontWeight: '800',
  },
  content: {
    flex: 1,
    gap: spacing.lg,
    justifyContent: 'center',
    padding: spacing.lg,
  },
  formCard: {
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderRadius: radii.lg,
    borderWidth: 1,
    gap: spacing.sm,
    padding: spacing.lg,
  },
  hero: {
    gap: spacing.sm,
  },
  hint: {
    color: colors.mutedText,
    fontSize: 13,
    lineHeight: 19,
    marginTop: spacing.xs,
  },
  input: {
    backgroundColor: colors.background,
    borderColor: colors.border,
    borderRadius: radii.md,
    borderWidth: 1,
    color: colors.text,
    fontSize: 16,
    marginBottom: spacing.sm,
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
  textArea: {
    minHeight: 96,
    textAlignVertical: 'top',
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
