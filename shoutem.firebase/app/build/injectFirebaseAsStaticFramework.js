const {
  getPodfilePath,
  projectPath,
  inject,
  ANCHORS,
} = require('@shoutem/build-tools');

function injectFirebaseAsStaticFramework() {
  const podfilePath = getPodfilePath({ cwd: projectPath });

  const firebaseAsStaticFrameworkString = '$RNFirebaseAsStaticFramework = true';

  inject(
    podfilePath,
    ANCHORS.IOS.PODFILE.STATIC_FRAMEWORKS,
    firebaseAsStaticFrameworkString,
  );
}

module.exports = {
  injectFirebaseAsStaticFramework,
};
