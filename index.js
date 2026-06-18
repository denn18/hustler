const { AppRegistry } = require('react-native');
const App = require('./App').default;

// Register the app directly with React Native instead of importing
// `registerRootComponent` from `expo`. This keeps Metro from needing to
// resolve the Expo package while it is bundling the entry file, which avoids
// the "Unable to resolve \"expo\" from \"index.js\"" startup failure in
// Expo Go when the CLI is available but Metro cannot resolve the local Expo
// module yet.
AppRegistry.registerComponent('main', () => App);
