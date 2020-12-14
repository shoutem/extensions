const _ = require('lodash');
const fs = require('fs-extra');
const path = require('path');
const { projectPath } = require('@shoutem/build-tools');
const { ext } = require('./const');

function injectFirebaseSettingsFile() {
  const filePath = path.resolve(projectPath, 'firebase.json');

  try {
    fs.ensureFileSync(filePath);
    const existingConfig = fs.readJsonSync(filePath, { throws: false });
    const config = { messaging_ios_auto_register_for_remote_messages: false };
    const actionTaken = _.isEmpty(existingConfig) ? 'Created' : 'Modified';
    const newConfig = existingConfig ? _.merge(existingConfig, config) : config;
    fs.writeJsonSync(filePath, newConfig);

    console.log(`[${ext()}] - ${actionTaken} root/firebase.json`);
  } catch (error) {
    console.log(error);
  }
}

module.exports = {
  injectFirebaseSettingsFile,
};
