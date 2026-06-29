import { AuthPage } from '../pages/AuthPage';
import { DashboardPage } from '../pages/DashboardPage';
import type { UserProfile } from '../models/hustler';

type AppNavigatorProps = {
  isAuthenticated: boolean;
  onAuthenticate: (user: UserProfile) => void;
  user: UserProfile | null;
};

export function AppNavigator({ isAuthenticated, onAuthenticate, user }: AppNavigatorProps) {
  if (!isAuthenticated) {
    return <AuthPage onAuthenticate={onAuthenticate} />;
  }

  return user ? <DashboardPage user={user} /> : <AuthPage onAuthenticate={onAuthenticate} />;
}
