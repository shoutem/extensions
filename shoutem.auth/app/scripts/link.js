const { reactNativeLink, getMainApplicationPath, replace } = require('@shoutem/build-tools');
const { fbSdk } = require('../build/const');

function replaceFbSdkPackageRegistration() {
  // linking will add a `new FBSDKPackage()` to android MainApplication.java
  // we need to replace it with correct package registration
  const mainApplication = getMainApplicationPath();
  replace(mainApplication, 'new FBSDKPackage(),', fbSdk.android.mainApplication.package);
}

reactNativeLink('@react-native-community/async-storage');
reactNativeLink('react-native-fbsdk');
reactNativeLink('react-native-image-picker');
replaceFbSdkPackageRegistration();
