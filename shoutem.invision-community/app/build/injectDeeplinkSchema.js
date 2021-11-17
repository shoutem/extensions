const fs = require('fs-extra');
const plist = require('plist');
const {
  ANCHORS,
  getAndroidManifestPath,
  inject,
  projectPath,
} = require('@shoutem/build-tools');

function injectDeeplinkSchemaAndroid(appId) {
  const intentFilter = `<intent-filter>
    <action android:name="android.intent.action.VIEW" />
    <category android:name="android.intent.category.DEFAULT" />
    <category android:name="android.intent.category.BROWSABLE" />
    <data android:scheme="app${appId}"
      android:host="*" />
  </intent-filter>`;

  // AndroidManifest.xml mods
  const androidManifestPath = getAndroidManifestPath({ cwd: projectPath });
  inject(
    androidManifestPath,
    ANCHORS.ANDROID.MANIFEST.MAIN_ACTIVITY_INTENT_FILTERS,
    intentFilter,
  );
}

function parsePlist(plistPath) {
  let plistResult = {};

  if (fs.existsSync(plistPath)) {
    const plistContent = fs.readFileSync(plistPath, 'utf8');

    try {
      plistResult = plist.parse(plistContent);
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error('Unable to parse plist', plistPath);
    }
  }

  return plistResult;
}

function injectDeeplinkSchemaIos(appId) {
  const plistPath = 'ios/Info.plist';
  const currentPlist = parsePlist(plistPath);
  const newPlist = {
    ...currentPlist,
    CFBundleURLTypes: [
      {
        CFBundleTypeRole: 'Editor',
        CFBundleURLName: `app${appId}`,
        CFBundleURLSchemes: [`app${appId}`],
      },
    ],
  };

  fs.writeFileSync(plistPath, plist.build(newPlist));
}

function injectDeeplinkSchema(appId) {
  injectDeeplinkSchemaAndroid(appId);
  injectDeeplinkSchemaIos(appId);
}

module.exports = injectDeeplinkSchema;
