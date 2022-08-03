const maps = {
  android: {
    mainApplication: {
      import: 'import com.airbnb.android.react.maps.MapsPackage;',
      getPackage: 'packages.add(new MapsPackage());',
    },
    gradle: {
      app: {
        dependencies: "implementation project(':react-native-maps')",
      },
      settings: `include ':react-native-maps'\nproject(':react-native-maps').projectDir = new File(rootProject.projectDir, '../node_modules/react-native-maps/android')`,
    },
    manifest:
      '<meta-data android:name="com.google.android.geo.API_KEY" android:value="AIzaSyBAefhRlXEH3vCko-zZTX6PHllTR6av4WI"/>',
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

module.exports = {
  maps,
  splashScreen,
};
