/* eslint-disable max-len, quotes */
'use_strict';

const fs = require('fs');
const appDelegateHeaderPath = 'ios/ShoutemApp/AppDelegate.h';
const appDelegatePath = 'ios/ShoutemApp/AppDelegate.m';

let appDelegateHeaderContents = fs.readFileSync(appDelegateHeaderPath, "utf8");
let appDelegateContents = fs.readFileSync(appDelegatePath, "utf8");

// 1. Add the header import statement
const userNotificationsModuleImportStatement = '@import UserNotifications;';
if (~appDelegateHeaderContents.indexOf(userNotificationsModuleImportStatement)) {
  console.log(`${userNotificationsModuleImportStatement} module already imported in ${appDelegateHeaderPath}.`);
} else {
  const uiKitImportStatement = '#import <UIKit/UIKit.h>';
  appDelegateHeaderContents = appDelegateHeaderContents.replace(uiKitImportStatement,
    `${uiKitImportStatement}\n${userNotificationsModuleImportStatement}`);
}

// 2. Add the UNUserNotificationCenterDelegate protocol
const userNotificationCenterDelegate = 'UNUserNotificationCenterDelegate';
if (~appDelegateHeaderContents.indexOf(userNotificationCenterDelegate)) {
  console.log(`${userNotificationCenterDelegate} protocol already declared in ${appDelegateHeaderPath}.`);
} else {
  const uiApplicationDelegateLine = `@interface AppDelegate : UIResponder <UIApplicationDelegate>`;
  appDelegateHeaderContents = appDelegateHeaderContents.replace(uiApplicationDelegateLine,
    `@interface AppDelegate : UIResponder <UIApplicationDelegate,${userNotificationCenterDelegate}>`);
}

// 3. Add RNFIRMessaging.h import statement to AppDelegate.m
const firHeaderImportStatement = '#import "RNFIRMessaging.h"';

if (~appDelegateContents.indexOf(firHeaderImportStatement)) {
  console.log(`patch ${firHeaderImportStatement} already set in ${appDelegatePath}.`);
} else {
  const appDelegateHeaderImportStatement = '#import "AppDelegate.h"';
  appDelegateContents = appDelegateContents.replace(appDelegateHeaderImportStatement,
    `${appDelegateHeaderImportStatement}\n${firHeaderImportStatement}`);
}

// 4. Add to applicationDidFinishLaunchingWithOptions
const notificationCenterInitializationPatch = `
  [FIRApp configure];
  #if defined(__IPHONE_10_0) && __IPHONE_OS_VERSION_MAX_ALLOWED >= __IPHONE_10_0
  [[UNUserNotificationCenter currentNotificationCenter] setDelegate:self];
  #endif
`;

if (~appDelegateContents.indexOf(notificationCenterInitializationPatch)) {
  console.log(`patch ${notificationCenterInitializationPatch} already set in ${appDelegatePath}.`);
} else {
  const appDidFinishMark = '//NativeModuleInjectionMark-appDelegate-applicationDidFinishLaunchingWithOptions';
  appDelegateContents = appDelegateContents.replace(appDidFinishMark,
    `${appDidFinishMark}\n${notificationCenterInitializationPatch}`);
}

// 5. Add methods to app delegate body
const addMethodsPatch = `
#if defined(__IPHONE_10_0) && __IPHONE_OS_VERSION_MAX_ALLOWED >= __IPHONE_10_0
- (void)userNotificationCenter:(UNUserNotificationCenter *)center willPresentNotification:(UNNotification *)notification withCompletionHandler:(void (^)(UNNotificationPresentationOptions))completionHandler
{
  [[NSNotificationCenter defaultCenter] postNotificationName:FCMNotificationReceived object:self userInfo:notification.request.content.userInfo];
    if([[notification.request.content.userInfo valueForKey:@"show_in_foreground"] isEqual:@YES]){
    completionHandler(UNNotificationPresentationOptionAlert | UNNotificationPresentationOptionBadge | UNNotificationPresentationOptionSound);
  }else{
    completionHandler(UNNotificationPresentationOptionNone);
  }

}

- (void)userNotificationCenter:(UNUserNotificationCenter *)center didReceiveNotificationResponse:(UNNotificationResponse *)response withCompletionHandler:(void (^)())completionHandler
{
  NSDictionary* userInfo = [[NSMutableDictionary alloc] initWithDictionary: response.notification.request.content.userInfo];
  [userInfo setValue:@YES forKey:@"opened_from_tray"];
  [[NSNotificationCenter defaultCenter] postNotificationName:FCMNotificationReceived object:self userInfo:userInfo];
}
#else
//You can skip this method if you don't want to use local notification
-(void)application:(UIApplication *)application didReceiveLocalNotification:(UILocalNotification *)notification {
  [[NSNotificationCenter defaultCenter] postNotificationName:FCMNotificationReceived object:self + userInfo:notification.userInfo];
}
#endif

- (void)application:(UIApplication *)application didReceiveRemoteNotification:(nonnull NSDictionary *)userInfo fetchCompletionHandler:(nonnull void (^)(UIBackgroundFetchResult))completionHandler{
  [[NSNotificationCenter defaultCenter] postNotificationName:FCMNotificationReceived object:self userInfo:userInfo];
  completionHandler(UIBackgroundFetchResultNoData);
}
`;

if (~appDelegateContents.indexOf(addMethodsPatch)) {
  console.log(`patch ${addMethodsPatch} already set in ${appDelegatePath}.`);
} else {
  const appDelegateBodyMark = '//NativeModuleInjectionMark-appDelegate-body';
  appDelegateContents = appDelegateContents.replace(appDelegateBodyMark,
    `${appDelegateBodyMark}\n${addMethodsPatch}`);
}

fs.writeFileSync(appDelegateHeaderPath, appDelegateHeaderContents);
fs.writeFileSync(appDelegatePath, appDelegateContents);

