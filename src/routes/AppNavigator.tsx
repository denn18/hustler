import { AuthPage } from '../pages/AuthPage';
import { DashboardPage } from '../pages/DashboardPage';

type AppNavigatorProps = {
  isAuthenticated: boolean;
  onAuthenticate: (user: { email: string; username: string }) => void;
  username: string;
};

export function AppNavigator({ isAuthenticated, onAuthenticate, username }: AppNavigatorProps) {
  if (!isAuthenticated) {
    return <AuthPage onAuthenticate={onAuthenticate} />;
  }

  return <DashboardPage username={username} />;
}
