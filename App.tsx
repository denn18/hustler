import { useState } from 'react';

import { AppNavigator } from './src/routes/AppNavigator';

export default function App() {
  const [user, setUser] = useState<{ email: string; username: string } | null>(null);

  return (
    <AppNavigator
      isAuthenticated={user !== null}
      onAuthenticate={setUser}
      username={user?.username ?? ''}
    />
  );
}
