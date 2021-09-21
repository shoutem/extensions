const {
  getAndroidManifestPath,
  getAppGradlePath,
  projectPath,
  inject,
  ANCHORS,
} = require('@shoutem/build-tools');
const { shopify } = require('./const');

function injectShopifyAndroid() {
  const appManifest = getAndroidManifestPath({ cwd: projectPath });
  inject(
    appManifest,
    ANCHORS.ANDROID.MANIFEST.ROOT,
    shopify.android.manifest.root.usesSdk,
  );

  const appGradlePath = getAppGradlePath({ cwd: projectPath });
  inject(
    appGradlePath,
    ANCHORS.ANDROID.GRADLE.APP.ANDROID_END,
    shopify.android.gradle.app.compileOptions,
  );
}

function injectShopifyIos() {}

module.exports = {
  injectShopifyAndroid,
  injectShopifyIos,
};
