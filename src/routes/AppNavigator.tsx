import { AuthPage } from '../pages/AuthPage';
import { useState, type ReactNode } from 'react';
import { Pressable, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, View } from 'react-native';

import { CreateEntryPage } from '../pages/CreateEntryPage';
import { CreateHustlePage } from '../pages/CreateHustlePage';
import { DashboardPage, SettingsSection } from '../pages/DashboardPage';
import { TutorialPage } from '../pages/TutorialPage';
import type { UserProfile } from '../models/hustler';
import { colors, radii, spacing } from '../design/theme';
import { getPublicDisplayName } from '../services/authService';

type MainTab = 'dashboard' | 'map' | 'account' | 'settings';

type AppNavigatorProps = {
  isAuthenticated: boolean;
  onAuthenticate: (user: UserProfile) => void;
  onUpdateUser: (user: UserProfile) => void;
  user: UserProfile | null;
};

export function AppNavigator({ isAuthenticated, onAuthenticate, onUpdateUser, user }: AppNavigatorProps) {
  const [activePage, setActivePage] = useState<'dashboard' | 'createEntry' | 'createHustle'>('dashboard');
  const [activeTab, setActiveTab] = useState<MainTab>('dashboard');
  if (!isAuthenticated) {
    return <AuthPage onAuthenticate={onAuthenticate} />;
  }

  if (!user) {
    return <AuthPage onAuthenticate={onAuthenticate} />;
  }

  if (!user.hasCompletedTutorial) {
    return <TutorialPage onComplete={onUpdateUser} user={user} />;
  }

  if (activePage === 'createEntry') {
    return (
      <CreateEntryPage
        onCancel={() => setActivePage('dashboard')}
        onCreated={(updatedUser) => {
          onUpdateUser(updatedUser);
          setActivePage('dashboard');
        }}
        user={user}
      />
    );
  }

  if (activePage === 'createHustle') {
    return (
      <CreateHustlePage
        onCancel={() => setActivePage('dashboard')}
        onCreated={(updatedUser) => {
          onUpdateUser(updatedUser);
          setActivePage('dashboard');
        }}
        user={user}
      />
    );
  }

  return (
    <MainTabShell activeTab={activeTab} onSelectTab={setActiveTab}>
      {activeTab === 'dashboard' ? (
        <DashboardPage
          onCreateEntry={() => setActivePage('createEntry')}
          onCreateHustle={() => setActivePage('createHustle')}
          user={user}
        />
      ) : null}
      {activeTab === 'map' ? <MapPage user={user} /> : null}
      {activeTab === 'account' ? <AccountPage user={user} /> : null}
      {activeTab === 'settings' ? <SettingsPage onUpdateUser={onUpdateUser} user={user} /> : null}
    </MainTabShell>
  );
}

const tabs: Array<{ icon: string; key: MainTab; label: string }> = [
  { icon: '🏠', key: 'dashboard', label: 'Dashboard' },
  { icon: '🗺️', key: 'map', label: 'Karte' },
  { icon: '👤', key: 'account', label: 'Konto' },
  { icon: '⚙️', key: 'settings', label: 'Settings' },
];

function MainTabShell({ activeTab, children, onSelectTab }: { activeTab: MainTab; children: ReactNode; onSelectTab: (tab: MainTab) => void }) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" />
      <View style={styles.screen}>{children}</View>
      <View style={styles.bottomNav}>
        {tabs.map((tab) => {
          const isActive = activeTab === tab.key;
          return (
            <Pressable
              accessibilityRole="tab"
              accessibilityState={{ selected: isActive }}
              key={tab.key}
              onPress={() => onSelectTab(tab.key)}
              style={[styles.navItem, isActive && styles.navItemActive]}
            >
              <Text style={styles.navIcon}>{tab.icon}</Text>
              <Text style={[styles.navLabel, isActive && styles.navLabelActive]}>{tab.label}</Text>
            </Pressable>
          );
        })}
      </View>
    </SafeAreaView>
  );
}

function MapPage({ user }: { user: UserProfile }) {
  const location = [user.area, user.city].filter(Boolean).join(', ') || 'Standort noch nicht gesetzt';
  return (
    <ScrollableTab title="Karte" subtitle="Finde später öffentliche Hustles in deiner Nähe und steuere deine Sichtbarkeit.">
      <InfoCard title="Dein Kartenbereich" value={location} />
      <InfoCard title="Karten-Sichtbarkeit" value={user.isMapVisible ? 'Aktiv' : 'Ausgeblendet'} />
      <Text style={styles.muted}>Die Kartenansicht ist vorbereitet. Sobald öffentliche Angebote verfügbar sind, landest du über die Navbar direkt hier.</Text>
    </ScrollableTab>
  );
}

function AccountPage({ user }: { user: UserProfile }) {
  return (
    <ScrollableTab title="Konto" subtitle="Dein Profil, deine öffentlichen Angaben und dein Hustler-Status.">
      <InfoCard title="Name" value={getPublicDisplayName(user)} />
      <InfoCard title="Username" value={`@${user.username}`} />
      <InfoCard title="Angebot" value={user.offering || 'Noch kein Angebot hinterlegt'} />
      {user.bio ? <InfoCard title="Bio" value={user.bio} /> : null}
    </ScrollableTab>
  );
}

function SettingsPage({ onUpdateUser, user }: { onUpdateUser: (user: UserProfile) => void; user: UserProfile }) {
  return (
    <ScrollableTab title="Einstellungen" subtitle="Passe Sichtbarkeit, Standort und dein Monatsziel an.">
      <SettingsSection onUpdateUser={onUpdateUser} user={user} />
    </ScrollableTab>
  );
}

function ScrollableTab({ children, subtitle, title }: { children: ReactNode; subtitle: string; title: string }) {
  return (
    <ScrollView contentContainerStyle={styles.tabContent} style={styles.scrollView}>
      <View style={styles.header}>
        <Text style={styles.kicker}>Hustler</Text>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
      </View>
      {children}
    </ScrollView>
  );
}

function InfoCard({ title, value }: { title: string; value: string }) {
  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>{title}</Text>
      <Text style={styles.cardValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  bottomNav: {
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderRadius: radii.lg,
    borderWidth: 1,
    flexDirection: 'row',
    gap: spacing.xs,
    margin: spacing.md,
    padding: spacing.xs,
  },
  card: {
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderRadius: radii.lg,
    borderWidth: 1,
    gap: spacing.sm,
    padding: spacing.lg,
  },
  cardTitle: { color: colors.mutedText, fontSize: 14, fontWeight: '700' },
  cardValue: { color: colors.text, fontSize: 20, fontWeight: '900' },
  header: { gap: spacing.sm },
  kicker: { color: colors.primary, fontSize: 14, fontWeight: '700', letterSpacing: 1, textTransform: 'uppercase' },
  muted: { color: colors.mutedText, fontSize: 15, lineHeight: 22 },
  navIcon: { fontSize: 18 },
  navItem: { alignItems: 'center', borderRadius: radii.md, flex: 1, gap: spacing.xs, paddingVertical: spacing.sm },
  navItemActive: { backgroundColor: colors.border },
  navLabel: { color: colors.mutedText, fontSize: 12, fontWeight: '800' },
  navLabelActive: { color: colors.primaryText },
  safeArea: { backgroundColor: colors.background, flex: 1 },
  screen: { flex: 1 },
  scrollView: { flex: 1 },
  subtitle: { color: colors.mutedText, fontSize: 16, lineHeight: 24 },
  tabContent: { gap: spacing.lg, padding: spacing.lg, paddingBottom: spacing.xl },
  title: { color: colors.text, fontSize: 34, fontWeight: '900' },
});
