const {
  getAndroidManifestPath,
  inject,
  ANCHORS,
  projectPath,
} = require('@shoutem/build-tools');
const fs = require('fs-extra');
const { maps } = require('./const');

function removeStringFromXML(filePath, stringToRemove) {
  try {
    const data = fs.readFileSync(filePath, 'utf8');
    const updatedData = data.replace(new RegExp(stringToRemove, 'g'), '');

    fs.writeFileSync(filePath, updatedData, 'utf8');
  } catch (err) {
    console.error('Error processing the file:', err);
  }
}

function injectAndroid(buildConfig) {
  const androidManifestPath = getAndroidManifestPath({ cwd: projectPath });

  // Temporary failsafe for the old key inclusion via platform file. Safe to remove with next platform
  // after version 15.0.0
  const stringToRemove =
    '<meta-data android:name="com.google.android.geo.API_KEY" android:value="AIzaSyBAefhRlXEH3vCko-zZTX6PHllTR6av4WI"/>';
  removeStringFromXML(androidManifestPath, stringToRemove);

  inject(
    androidManifestPath,
    ANCHORS.ANDROID.MANIFEST.APPLICATION,
    maps.android.manifest(buildConfig.googleMapsAndroidKey),
  );
}

function injectMaps(buildConfig) {
  injectAndroid(buildConfig);
}

module.exports = injectMaps;
