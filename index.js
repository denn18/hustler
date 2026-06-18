import { registerRootComponent } from 'expo';

import App from './App';

// Register the root component from a project-local entry file instead of
// asking Metro to resolve Expo's AppEntry from node_modules. This keeps iOS,
// Android, and web bundling stable even when Metro is started from the repo
// root or node_modules are reinstalled.
registerRootComponent(App);
