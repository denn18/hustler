import { AuthPage } from '../pages/AuthPage';
import { useState } from 'react';

import { CreateHustlePage } from '../pages/CreateHustlePage';
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
  const [activePage, setActivePage] = useState<'dashboard' | 'createHustle'>('dashboard');
  if (!isAuthenticated) {
    return <AuthPage onAuthenticate={onAuthenticate} />;
  }

  if (!user) {
    return <AuthPage onAuthenticate={onAuthenticate} />;
  }

  if (!user.hasCompletedTutorial) {
    return <TutorialPage onComplete={onUpdateUser} user={user} />;
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

  return <DashboardPage onCreateHustle={() => setActivePage('createHustle')} onUpdateUser={onUpdateUser} user={user} />;
}
