const appDelegateImport = `
#import <React/RCTLinkingManager.h>
#import <FBSDKCoreKit/FBSDKCoreKit.h>
`;

const appDelegateOpenUrl = `
- (BOOL)application:(UIApplication *)app
            openURL:(NSURL *)url
            options:(NSDictionary<UIApplicationOpenURLOptionsKey,id> *)options
{
  if ([[FBSDKApplicationDelegate sharedInstance] application:app openURL:url options:options]) {
    return YES;
  }

  if ([RCTLinkingManager application:app openURL:url options:options]) {
    return YES;
  }

  return NO;
}
`;

const androidApplicationMetaData = `
    <meta-data android:name="com.facebook.sdk.ApplicationId" android:value="@string/facebook_app_id"/>
    <meta-data android:name="com.facebook.sdk.ClientToken" android:value="@string/facebook_client_token"/>
`;

const facebookActivity = `
<activity android:name="com.facebook.FacebookActivity"
          android:configChanges="keyboard|keyboardHidden|screenLayout|screenSize|orientation"
          android:label="@string/app_name" />
`;

const fbSdk = {
  ios: {
    appDelegate: {
      import: appDelegateImport,
      didFinishLaunchingWithOptions:
        '[FBSDKApplicationDelegate.sharedInstance initializeSDK];',
      didFinishLaunchingWithOptionsEnd:
        '[[FBSDKApplicationDelegate sharedInstance] application:application didFinishLaunchingWithOptions:launchOptions];',
      body: appDelegateOpenUrl,
    },
  },
  android: {
    mainApplication: {
      import: 'import com.facebook.reactnative.androidsdk.FBSDKPackage;',
      package: 'packages.add(new FBSDKPackage());',
    },
    gradle: {
      app: {
        dependencies: "implementation project(':react-native-fbsdk-next')",
      },
      settings:
        "include ':react-native-fbsdk-next'\nproject(':react-native-fbsdk-next').projectDir = new File(rootProject.projectDir, '../node_modules/react-native-fbsdk-next/android')",
    },
    manifest: {
      facebookActivity,
      applicationMetaData: androidApplicationMetaData,
      removeAdIdPermission:
        '<uses-permission android:name="com.google.android.gms.permission.AD_ID" tools:node="remove"/>',
    },
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
