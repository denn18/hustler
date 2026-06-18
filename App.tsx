import { useMemo, useState } from 'react';
import { SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type ScreenKey = 'today' | 'plan' | 'progress';

type Task = {
  id: number;
  title: string;
  detail: string;
  minutes: number;
};

const screens: Array<{ key: ScreenKey; label: string }> = [
  { key: 'today', label: 'Heute' },
  { key: 'plan', label: 'Plan' },
  { key: 'progress', label: 'Fortschritt' },
];

const tasks: Task[] = [
  { id: 1, title: 'Fokus-Block', detail: 'Arbeite 45 Minuten an deinem wichtigsten Hustle.', minutes: 45 },
  { id: 2, title: 'Kundenkontakt', detail: 'Schreibe drei warme Leads oder Community-Kontakte an.', minutes: 20 },
  { id: 3, title: 'Review', detail: 'Notiere, was Umsatz, Reichweite oder Klarheit gebracht hat.', minutes: 10 },
];

export default function App() {
  const [activeScreen, setActiveScreen] = useState<ScreenKey>('today');
  const totalMinutes = useMemo(() => tasks.reduce((sum, task) => sum + task.minutes, 0), []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.hero}>
          <Text style={styles.kicker}>Hustler OS</Text>
          <Text style={styles.title}>Starte deinen Tag ohne Setup-Chaos.</Text>
          <Text style={styles.subtitle}>
            Eine frische, schlanke Expo-App ohne eigene Babel-Konfiguration und ohne alte Projektreste.
          </Text>
        </View>

        <View style={styles.tabs}>
          {screens.map((screen) => (
            <TouchableOpacity
              accessibilityRole="button"
              key={screen.key}
              onPress={() => setActiveScreen(screen.key)}
              style={[styles.tab, activeScreen === screen.key && styles.activeTab]}
            >
              <Text style={[styles.tabText, activeScreen === screen.key && styles.activeTabText]}>
                {screen.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {activeScreen === 'today' && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Heute erledigen</Text>
            {tasks.map((task) => (
              <View key={task.id} style={styles.taskRow}>
                <View style={styles.taskNumber}>
                  <Text style={styles.taskNumberText}>{task.id}</Text>
                </View>
                <View style={styles.taskBody}>
                  <Text style={styles.taskTitle}>{task.title}</Text>
                  <Text style={styles.taskDetail}>{task.detail}</Text>
                </View>
                <Text style={styles.minutes}>{task.minutes}m</Text>
              </View>
            ))}
          </View>
        )}

        {activeScreen === 'plan' && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Einfacher Wochenplan</Text>
            <Text style={styles.paragraph}>
              Wähle jeden Morgen eine Umsatz-Aufgabe, eine Lern-Aufgabe und eine sichtbare Aktion. Mehr braucht die erste Version nicht.
            </Text>
            <View style={styles.highlightBox}>
              <Text style={styles.highlightText}>Heute geplant: {totalMinutes} Minuten konzentrierte Arbeit.</Text>
            </View>
          </View>
        )}

        {activeScreen === 'progress' && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Fortschritt</Text>
            <View style={styles.metricGrid}>
              <View style={styles.metric}>
                <Text style={styles.metricValue}>3</Text>
                <Text style={styles.metricLabel}>Aufgaben</Text>
              </View>
              <View style={styles.metric}>
                <Text style={styles.metricValue}>{totalMinutes}</Text>
                <Text style={styles.metricLabel}>Minuten</Text>
              </View>
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0B1020',
  },
  content: {
    gap: 18,
    padding: 20,
    paddingBottom: 36,
  },
  hero: {
    backgroundColor: '#141A2E',
    borderRadius: 28,
    padding: 24,
  },
  kicker: {
    color: '#7DD3FC',
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 1.5,
    marginBottom: 10,
    textTransform: 'uppercase',
  },
  title: {
    color: '#F8FAFC',
    fontSize: 32,
    fontWeight: '900',
    lineHeight: 38,
  },
  subtitle: {
    color: '#CBD5E1',
    fontSize: 16,
    lineHeight: 24,
    marginTop: 14,
  },
  tabs: {
    backgroundColor: '#111827',
    borderRadius: 999,
    flexDirection: 'row',
    padding: 5,
  },
  tab: {
    borderRadius: 999,
    flex: 1,
    paddingVertical: 12,
  },
  activeTab: {
    backgroundColor: '#38BDF8',
  },
  tabText: {
    color: '#94A3B8',
    fontSize: 14,
    fontWeight: '800',
    textAlign: 'center',
  },
  activeTabText: {
    color: '#082F49',
  },
  card: {
    backgroundColor: '#F8FAFC',
    borderRadius: 26,
    gap: 16,
    padding: 20,
  },
  cardTitle: {
    color: '#0F172A',
    fontSize: 22,
    fontWeight: '900',
  },
  taskRow: {
    alignItems: 'center',
    backgroundColor: '#E2E8F0',
    borderRadius: 18,
    flexDirection: 'row',
    gap: 12,
    padding: 14,
  },
  taskNumber: {
    alignItems: 'center',
    backgroundColor: '#0F172A',
    borderRadius: 14,
    height: 34,
    justifyContent: 'center',
    width: 34,
  },
  taskNumberText: {
    color: '#FFFFFF',
    fontWeight: '900',
  },
  taskBody: {
    flex: 1,
  },
  taskTitle: {
    color: '#0F172A',
    fontSize: 16,
    fontWeight: '900',
  },
  taskDetail: {
    color: '#475569',
    fontSize: 13,
    lineHeight: 18,
    marginTop: 3,
  },
  minutes: {
    color: '#0369A1',
    fontWeight: '900',
  },
  paragraph: {
    color: '#334155',
    fontSize: 16,
    lineHeight: 24,
  },
  highlightBox: {
    backgroundColor: '#DBEAFE',
    borderRadius: 18,
    padding: 16,
  },
  highlightText: {
    color: '#1E3A8A',
    fontSize: 16,
    fontWeight: '900',
  },
  metricGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  metric: {
    backgroundColor: '#E0F2FE',
    borderRadius: 20,
    flex: 1,
    padding: 18,
  },
  metricValue: {
    color: '#075985',
    fontSize: 30,
    fontWeight: '900',
  },
  metricLabel: {
    color: '#0369A1',
    fontWeight: '800',
    marginTop: 4,
  },
});
