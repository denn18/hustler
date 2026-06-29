import { AuthPage } from '../pages/AuthPage';
import { DashboardPage } from '../pages/DashboardPage';
import { TutorialPage } from '../pages/TutorialPage';
import type { UserProfile } from '../models/hustler';

type AppNavigatorProps = {
  isAuthenticated: boolean;
  onAuthenticate: (user: UserProfile) => void;
  onUpdateUser: (user: UserProfile) => void;
  user: UserProfile | null;
};

export function AppNavigator({ isAuthenticated, onAuthenticate, onUpdateUser, user }: AppNavigatorProps) {
  if (!isAuthenticated) {
    return <AuthPage onAuthenticate={onAuthenticate} />;
  }

  if (!user) {
    return <AuthPage onAuthenticate={onAuthenticate} />;
  }

  if (!user.hasCompletedTutorial) {
    return <TutorialPage onComplete={onUpdateUser} user={user} />;
  }

  return <DashboardPage onUpdateUser={onUpdateUser} user={user} />;
}
