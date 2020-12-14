const {
  getAndroidManifestPath,
  inject,
  ANCHORS,
  projectPath,
} = require('@shoutem/build-tools');

const billingPermission = `<uses-permission android:name="com.android.vending.BILLING" />`;

function injectBillingPermission() {
  const manifestPath = getAndroidManifestPath({ cwd: projectPath });

  inject(manifestPath, ANCHORS.ANDROID.MANIFEST.ROOT, billingPermission);

  console.log(`Android: Added BILLING permission to Android manifest`);
}

module.exports = {
  injectBillingPermission,
};
