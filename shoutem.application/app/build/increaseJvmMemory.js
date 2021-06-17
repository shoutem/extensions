const fs = require('fs-extra');
const {
  getGradlePropertiesPath,
  projectPath,
} = require('@shoutem/build-tools');

function increaseJvmMemory() {
  const searchText = '# org.gradle.jvmargs';
  const replaceText = 'org.gradle.jvmargs';

  const filePath = getGradlePropertiesPath({ cwd: projectPath });
  const fileContents = fs.readFileSync(filePath, 'utf8');

  const newFileContents = fileContents.replace(searchText, replaceText);

  fs.writeFileSync(filePath, newFileContents, 'utf8');
}

module.exports = increaseJvmMemory;
