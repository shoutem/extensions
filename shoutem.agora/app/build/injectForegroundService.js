const {
  getAndroidManifestPath,
  inject,
  ANCHORS,
  projectPath,
} = require('@shoutem/build-tools');

function injectForegroundService() {
  const manifestPath = getAndroidManifestPath({ cwd: projectPath });

  const androidManifestApplication = `
<service
    android:name=".AgoraService"
    android:foregroundServiceType="camera|microphone"
    android:exported="false">
</service>
`;

  inject(
    manifestPath,
    ANCHORS.ANDROID.MANIFEST.APPLICATION,
    androidManifestApplication,
  );
}

module.exports = {
  injectForegroundService,
};
