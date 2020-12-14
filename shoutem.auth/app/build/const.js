const reactNativeFbSdkDependencies = `
  # React Native FBSDK dependencies
  pod 'FBSDKCoreKit'
  pod 'FBSDKLoginKit'
`;

const appDelegateOpenUrl = `
- (BOOL)application:(UIApplication *)application
            openURL:(NSURL *)url
            options:(NSDictionary<UIApplicationOpenURLOptionsKey,id> *)options {

  BOOL handled = [[FBSDKApplicationDelegate sharedInstance] application:application
    openURL:url
    sourceApplication:options[UIApplicationOpenURLOptionsSourceApplicationKey]
    annotation:options[UIApplicationOpenURLOptionsAnnotationKey]
  ];
  return handled;
}
`;

const fbSdk = {
  ios: {
    appDelegate: {
      import: '#import <FBSDKCoreKit/FBSDKCoreKit.h>',
      didFinishLaunchingWithOptions: '[[FBSDKApplicationDelegate sharedInstance] application:application didFinishLaunchingWithOptions:launchOptions];',
      body: appDelegateOpenUrl,
    },
    podfile: {
      pods: reactNativeFbSdkDependencies,
    },
  },
  android: {
    mainApplication: {
      import: 'import com.facebook.reactnative.androidsdk.FBSDKPackage;',
      package: 'packages.add(new FBSDKPackage());',
    },
    gradle: {
      app: {
        dependencies: 'implementation project(\':react-native-fbsdk\')',
      },
      settings: 'include \':react-native-fbsdk\'\nproject(\':react-native-fbsdk\').projectDir = new File(rootProject.projectDir, \'../node_modules/react-native-fbsdk/android\')',
    },
    manifest: '<meta-data android:name="com.facebook.sdk.ApplicationId" android:value="@string/facebook_app_id"/>',
  },
};

const appleSignIn = {
  ios: {
    entitlements: {
      addEntitlement: `
      <key>com.apple.developer.applesignin</key>
      <array>
        <string>Default</string>
      </array>
      `,
    },
  },
};

module.exports = {
  fbSdk,
  appleSignIn,
};
