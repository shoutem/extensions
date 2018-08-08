const mapPods = `
  rn_path = '../node_modules/react-native'
  rn_maps_path = '../node_modules/react-native-maps'

  pod 'yoga', path: "#{rn_path}/ReactCommon/yoga/yoga.podspec"
  pod 'React', path: rn_path, subspecs: [
    'Core',
    'CxxBridge',
    'DevSupport',
    'RCTActionSheet',
    'RCTAnimation',
    'RCTGeolocation',
    'RCTImage',
    'RCTLinkingIOS',
    'RCTNetwork',
    'RCTSettings',
    'RCTText',
    'RCTVibration',
    'RCTWebSocket',
  ]

  # React Native third party dependencies podspecs
  pod 'DoubleConversion', :podspec => "#{rn_path}/third-party-podspecs/DoubleConversion.podspec"
  pod 'glog', :podspec => "#{rn_path}/third-party-podspecs/glog.podspec"
  # If you are using React Native <0.54, you will get the following error:
  # "The name of the given podspec \`GLog\` doesn't match the expected one \`glog\`"
  # Use the following line instead:
  # pod 'GLog', :podspec => "#{rn_path}/third-party-podspecs/GLog.podspec"
  pod 'Folly', :podspec => "#{rn_path}/third-party-podspecs/Folly.podspec"

  # react-native-maps dependencies
  pod 'react-native-maps', path: rn_maps_path
  pod 'react-native-google-maps', path: rn_maps_path  # Remove this line if you don't want to support GoogleMaps on iOS
  pod 'GoogleMaps'  # Remove this line if you don't want to support GoogleMaps on iOS
  pod 'Google-Maps-iOS-Utils' # Remove this line if you don't want to support GoogleMaps on iOS
`;

const mapPostInstallTargets = `
    if target.name == 'react-native-google-maps'
      target.build_configurations.each do |config|
        config.build_settings['CLANG_ENABLE_MODULES'] = 'No'
      end
    end
    if target.name == "React"
      target.remove_from_project
    end
`;

const maps = {
  ios: {
    podfile: {
      pods: mapPods,
      podTargets: mapPostInstallTargets,
    },
  },
  android: {
    mainApplication: {
      import: 'import com.airbnb.android.react.maps.MapsPackage;',
      getPackage: 'new MapsPackage(),',
    },
    gradle: {
      app: {
        dependencies: 'compile project(\':react-native-maps\')',
      },
      settings: `include ':react-native-maps'\nproject(':react-native-maps').projectDir = new File(rootProject.projectDir, '../node_modules/react-native-maps/lib/android')`,
    },
    manifest: '<meta-data android:name="com.google.android.geo.API_KEY" android:value="AIzaSyBAefhRlXEH3vCko-zZTX6PHllTR6av4WI"/>',
  }
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
      import: '#import "SplashScreen.h"',
      didFinishLaunchingEnd: '[SplashScreen show];',
    },
  },
};

const videoDidFinishLaunching = `
  // This overrides silent switch and allows audio to play even if hardware switch is set to silent
  AVAudioSession *audioSession = [AVAudioSession sharedInstance];
  NSError *setCategoryError = nil;
  [audioSession setCategory:AVAudioSessionCategoryPlayback
                      error:&setCategoryError];
`;

const video = {
  ios: {
    appDelegate: {
      import: '#import <AVFoundation/AVFoundation.h>',
      didFinishLaunching: videoDidFinishLaunching,
    },
  },
};

module.exports = {
  maps,
  splashScreen,
  video,
};
