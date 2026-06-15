import { useState } from 'react';
import { Pressable, SafeAreaView, ScrollView, View } from 'react-native';
import { AppText } from './src/components/AppText';
import { OnboardingPage } from './src/pages/OnboardingPage';
import { RouteKey, routes } from './src/routes/tabs';
import { spacing } from './src/design/theme';
import { useAppTheme } from './src/design/useAppTheme';

export default function App() {
  const theme = useAppTheme();
  const [onboarded, setOnboarded] = useState(false);
  const [activeRoute, setActiveRoute] = useState<RouteKey>('dashboard');
  const ActivePage = routes.find((route) => route.key === activeRoute)?.component ?? routes[0].component;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
      <ScrollView contentContainerStyle={{ padding: spacing.md, paddingBottom: 110 }}>
        {onboarded ? <ActivePage /> : <OnboardingPage onFinish={() => setOnboarded(true)} />}
      </ScrollView>
      {onboarded ? (
        <View style={{ backgroundColor: theme.surface, borderColor: theme.border, borderTopWidth: 1, bottom: 0, flexDirection: 'row', gap: 4, left: 0, padding: spacing.sm, position: 'absolute', right: 0 }}>
          {routes.map((route) => {
            const active = route.key === activeRoute;
            return (
              <Pressable key={route.key} onPress={() => setActiveRoute(route.key)} style={{ backgroundColor: active ? theme.primary : 'transparent', borderRadius: 999, flex: 1, paddingVertical: spacing.sm }}>
                <AppText size={12} weight="800" style={{ color: active ? '#FFFFFF' : theme.text, textAlign: 'center' }}>{route.label}</AppText>
              </Pressable>
            );
          })}
        </View>
      ) : null}
    </SafeAreaView>
  );
}
