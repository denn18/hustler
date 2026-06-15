const path = require('path');
const { getDefaultConfig } = require('expo/metro-config');
const exclusionList = require('metro-config/src/defaults/exclusionList');

const projectRoot = __dirname;
const config = getDefaultConfig(projectRoot);

config.watchFolders = [projectRoot];
config.resolver.disableHierarchicalLookup = true;
config.resolver.nodeModulesPaths = [
  path.join(projectRoot, 'node_modules'),
  path.join(projectRoot, 'node_modules/react-native/node_modules'),
];
config.resolver.blockList = exclusionList([
  new RegExp(`${escapePath(projectRoot)}[/\\\\]\\.git([/\\\\].*)?$`),
  new RegExp(`${escapePath(projectRoot)}[/\\\\]\\.expo([/\\\\].*)?$`),
  new RegExp(`${escapePath(projectRoot)}[/\\\\]dist([/\\\\].*)?$`),
  new RegExp(`${escapePath(projectRoot)}[/\\\\]build([/\\\\].*)?$`),
  new RegExp(`${escapePath(projectRoot)}[/\\\\]coverage([/\\\\].*)?$`),
]);

function escapePath(filePath) {
  return filePath.replace(/[|\\{}()[\]^$+*?.]/g, '\\$&');
}

module.exports = config;
