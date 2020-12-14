const fs = require('fs-extra');
const {
  getGradlePropertiesPath,
  projectPath,
} = require('@shoutem/build-tools');

function injectTrackPlayer() {
  const searchText = '# org.gradle.jvmargs';
  const replaceText = 'org.gradle.jvmargs';

  const filePath = getGradlePropertiesPath({ cwd: projectPath });
  const fileContents = fs.readFileSync(filePath, 'utf8');

  const newFileContents = fileContents.replace(searchText, replaceText);

  fs.writeFileSync(filePath, newFileContents, 'utf8');

  console.log('[shoutem.audio] - Uncommenting JVM memory arguments in "android/gradle.properties" for `react-native-track-player`');
}

module.exports = {
  injectTrackPlayer,
};
