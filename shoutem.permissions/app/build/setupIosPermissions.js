const { execSync } = require('child_process');
const { projectPath } = require('@shoutem/build-tools');

function setupIosPermissions() {
  console.time('Setting up iOS permissions took');
  return execSync('react-native setup-ios-permissions', { cwd: projectPath });
  console.timeEnd('Setting up iOS permissions took');
}

module.exports = {
  setupIosPermissions,
};
