const {
  getPodfilePath,
  projectPath,
  inject,
  ANCHORS,
} = require('@shoutem/build-tools');

function injectAgoraSubspecs() {
  const podfilePath = getPodfilePath({ cwd: projectPath });

  const agoraSubspecsDefinition = `# Agora app size reduction, after upgrading to v4.
  # https://docs.agora.io/en/video-calling/reference/downloads?platform=ios
  pod 'AgoraRtcEngine_iOS', '4.3.1', :subspecs => ['RtcBasic']`;

  inject(podfilePath, ANCHORS.IOS.PODFILE.SUBSPECS, agoraSubspecsDefinition);
}

module.exports = {
  injectAgoraSubspecs,
};
