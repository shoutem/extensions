const {
  ANCHORS,
  getAndroidManifestPath,
  inject,
  projectPath,
} = require('@shoutem/build-tools');
const { deeplinkQueries } = require('./const');

function injectAndroidManifestQueries() {
  const androidManifestPath = getAndroidManifestPath({ cwd: projectPath });
  inject(
    androidManifestPath,
    ANCHORS.ANDROID.MANIFEST.QUERIES,
    deeplinkQueries.android.manifest.queries.tel,
  );
  inject(
    androidManifestPath,
    ANCHORS.ANDROID.MANIFEST.QUERIES,
    deeplinkQueries.android.manifest.queries.mailto,
  );
}

module.exports = {
  injectAndroidManifestQueries,
};
