import { useState } from 'react';

import { AppNavigator } from './src/routes/AppNavigator';
import type { UserProfile } from './src/models/hustler';

export default function App() {
  const [user, setUser] = useState<UserProfile | null>(null);

  return (
    <AppNavigator
      isAuthenticated={user !== null}
      onAuthenticate={setUser}
      user={user}
    />
  );
}
