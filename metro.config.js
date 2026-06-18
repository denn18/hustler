const path = require('path');
const { getDefaultConfig } = require('expo/metro-config');

const projectRoot = __dirname;
const config = getDefaultConfig(projectRoot);

// Keep Metro resolving packages from this app's local node_modules. This avoids
// failures where the CLI can resolve Expo but Metro's module resolver cannot,
// especially after reinstalling dependencies or when the app lives near other
// JavaScript workspaces.
config.resolver = {
  ...config.resolver,
  nodeModulesPaths: [path.join(projectRoot, 'node_modules')],
};

module.exports = config;
