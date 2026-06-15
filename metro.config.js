const path = require('path');
const { getDefaultConfig } = require('expo/metro-config');
const exclusionList = require('metro-config/src/defaults/exclusionList');

const projectRoot = __dirname;
const config = getDefaultConfig(projectRoot);

config.watchFolders = [projectRoot];
config.resolver.disableHierarchicalLookup = true;
config.resolver.nodeModulesPaths = [path.join(projectRoot, 'node_modules')];
config.resolver.blockList = exclusionList([
  /(^|[/\\])\.git([/\\].*)?$/,
  /(^|[/\\])\.expo([/\\].*)?$/,
  /(^|[/\\])dist([/\\].*)?$/,
  /(^|[/\\])build([/\\].*)?$/,
  /(^|[/\\])coverage([/\\].*)?$/,
]);

module.exports = config;
