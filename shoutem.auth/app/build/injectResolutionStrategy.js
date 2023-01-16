const {
  ANCHORS,
  getRootGradlePath,
  inject,
  projectPath,
} = require('@shoutem/build-tools');

const { resolutionStrategy } = require('./const');

function injectResolutionStrategy() {
  const rootGradlePath = getRootGradlePath({ cwd: projectPath });

  inject(
    rootGradlePath,
    ANCHORS.ANDROID.GRADLE.ROOT_GRADLE_ALLPROJECTS_CONFIGURATIONS_ALL_RESOLUTION_STRATEGY,
    resolutionStrategy,
  );
}

module.exports = {
  injectResolutionStrategy,
};
