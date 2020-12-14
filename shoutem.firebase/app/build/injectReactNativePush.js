/* eslint-disable max-len */
const {
  getAppGradlePath,
  getAndroidManifestPath,
  getAppDelegateHeaderPath,
  getAppDelegatePath,
  getRootGradlePath,
  inject,
  replace,
  ANCHORS,
  projectPath,
} = require('@shoutem/build-tools');

const androidPermissions = `
<uses-permission android:name="android.permission.WAKE_LOCK" />
<uses-permission android:name="android.permission.VIBRATE" />
<uses-permission android:name="android.permission.RECEIVE_BOOT_COMPLETED"/>
`;

const androidManifestApplication = `
<!-- Change the value to true to enable pop-up for in foreground (remote-only, for local use ignoreInForeground) -->
<meta-data  android:name="com.dieam.reactnativepushnotification.notification_foreground"
    android:value="false"/>
<!-- Change the resource name to your App's accent color - or any other color you want -->
<receiver android:name="com.dieam.reactnativepushnotification.modules.RNPushNotificationPublisher" />
<receiver android:name="com.dieam.reactnativepushnotification.modules.RNPushNotificationBootEventReceiver">
  <intent-filter>
    <action android:name="android.intent.action.BOOT_COMPLETED" />
  </intent-filter>
</receiver>

<service
  android:name="com.dieam.reactnativepushnotification.modules.RNPushNotificationListenerService"
  android:exported="false" >
    <intent-filter>
      <action android:name="com.google.firebase.MESSAGING_EVENT" />
    </intent-filter>
</service>
`;

const androidRootGradle = "classpath('com.google.gms:google-services:4.3.3')";
const androidPlugins = "apply plugin: 'com.google.gms.google-services'";

const appDelegateHeaderImport = '#import <UserNotifications/UNUserNotificationCenter.h>';
const appDelegateHeaderSearch = '@interface AppDelegate : UIResponder <UIApplicationDelegate, RCTBridgeDelegate>';
const appDelegateHeaderReplace = '@interface AppDelegate : UIResponder <UIApplicationDelegate, RCTBridgeDelegate, UNUserNotificationCenterDelegate>';

const appDelegateImport = `
#import <UserNotifications/UserNotifications.h>
#import <RNCPushNotificationIOS.h>
`;

const appDelegateBody = `
// Required to register for notifications
- (void)application:(UIApplication *)application didRegisterUserNotificationSettings:(UIUserNotificationSettings *)notificationSettings
{
 [RNCPushNotificationIOS didRegisterUserNotificationSettings:notificationSettings];
}
// Required for the register event.
- (void)application:(UIApplication *)application didRegisterForRemoteNotificationsWithDeviceToken:(NSData *)deviceToken
{
 [RNCPushNotificationIOS didRegisterForRemoteNotificationsWithDeviceToken:deviceToken];
}
// Required for the notification event. You must call the completion handler after handling the remote notification.
- (void)application:(UIApplication *)application didReceiveRemoteNotification:(NSDictionary *)userInfo
fetchCompletionHandler:(void (^)(UIBackgroundFetchResult))completionHandler
{
  [RNCPushNotificationIOS didReceiveRemoteNotification:userInfo fetchCompletionHandler:completionHandler];
}
// Required for the registrationError event.
- (void)application:(UIApplication *)application didFailToRegisterForRemoteNotificationsWithError:(NSError *)error
{
 [RNCPushNotificationIOS didFailToRegisterForRemoteNotificationsWithError:error];
}
// IOS 10+ Required for localNotification event
- (void)userNotificationCenter:(UNUserNotificationCenter *)center
didReceiveNotificationResponse:(UNNotificationResponse *)response
         withCompletionHandler:(void (^)(void))completionHandler
{
  [RNCPushNotificationIOS didReceiveNotificationResponse:response];
  completionHandler();
}
// IOS 4-10 Required for the localNotification event.
- (void)application:(UIApplication *)application didReceiveLocalNotification:(UILocalNotification *)notification
{
 [RNCPushNotificationIOS didReceiveLocalNotification:notification];
}
//Called when a notification is delivered to a foreground app.
-(void)userNotificationCenter:(UNUserNotificationCenter *)center willPresentNotification:(UNNotification *)notification withCompletionHandler:(void (^)(UNNotificationPresentationOptions options))completionHandler
{
  completionHandler(UNAuthorizationOptionSound | UNAuthorizationOptionAlert | UNAuthorizationOptionBadge);
}
`;

const appDelegateDidFinishLaunching = `
UNUserNotificationCenter *center = [UNUserNotificationCenter currentNotificationCenter];
  center.delegate = self;
`;

function injectIos() {
  // appDelegate.m mods
  const appDelegatePath = getAppDelegatePath({ cwd: projectPath });
  inject(appDelegatePath, ANCHORS.IOS.APP_DELEGATE.IMPORT, appDelegateImport);
  inject(appDelegatePath, ANCHORS.IOS.APP_DELEGATE.BODY, appDelegateBody);
  inject(appDelegatePath, ANCHORS.IOS.APP_DELEGATE.DID_FINISH_LAUNCHING_WITH_OPTIONS, appDelegateDidFinishLaunching);

  // appDelegate.h mods
  const appDelegateHeaderPath = getAppDelegateHeaderPath({ cwd: projectPath });
  inject(appDelegateHeaderPath, ANCHORS.IOS.APP_DELEGATE_HEADER.IMPORT, appDelegateHeaderImport);
  replace(appDelegateHeaderPath, appDelegateHeaderSearch, appDelegateHeaderReplace);
}

function injectAndroid() {
  // app/build.gradle mods
  const appGradlePath = getAppGradlePath({ cwd: projectPath });
  inject(appGradlePath, ANCHORS.ANDROID.GRADLE.APP.PLUGINS, androidPlugins);

  const rootGradlePath = getRootGradlePath({ cwd: projectPath });
  inject(rootGradlePath, ANCHORS.ANDROID.GRADLE.ROOT_GRADLE, androidRootGradle);

  const manifestPath = getAndroidManifestPath({ cwd: projectPath });
  inject(manifestPath, ANCHORS.ANDROID.MANIFEST.ROOT, androidPermissions);
  inject(manifestPath, ANCHORS.ANDROID.MANIFEST.APPLICATION, androidManifestApplication);
}

function injectReactNativePush() {
  injectIos();
  injectAndroid();
}

module.exports = {
  injectReactNativePush,
};
