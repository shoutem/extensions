const path = require('path');
const { projectPath } = require('@shoutem/build-tools');

const maps = {
  android: {
    manifest: key => `<meta-data android:name="com.google.android.geo.API_KEY" android:value="${key}"/>`,
  },
};

const splashScreen = {
  android: {
    mainActivity: {
      import: 'import org.devio.rn.splashscreen.SplashScreen;',
      onCreate: 'SplashScreen.show(this);',
    },
  },
  ios: {
    appDelegate: {
      import: '#import "RNSplashScreen.h"',
      didFinishLaunchingEnd: '[RNSplashScreen show];',
    },
  },
};

const aliases = {
  'react-native-maps': '@teovilla/react-native-web-maps',
  crypto: 'crypto-js',
  'shoutem-core': path.resolve(projectPath, 'core'),
  'react-native': 'react-native-web',
  'react-native-fast-image': 'react-native-web/dist/exports/Image',
  'react-native/Libraries/vendor/emitter/EventEmitter':
    'react-native-web/dist/vendor/react-native/EventEmitter/RCTDeviceEventEmitter.js',
};

module.exports = {
  maps,
  splashScreen,
  aliases,
};
