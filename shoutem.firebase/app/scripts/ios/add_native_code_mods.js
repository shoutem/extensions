/* eslint-disable max-len, quotes */
'use_strict';

const fs = require('fs');
const getAppDelegateHeaderPath = require('@shoutem/build-tools').getAppDelegateHeaderPath;
const getAppDelegatePath = require('@shoutem/build-tools').getAppDelegatePath;

const appDelegateHeaderPath = getAppDelegateHeaderPath();
const appDelegatePath = getAppDelegatePath();

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
  console.log(`firHeaderImportStatement already set in ${appDelegatePath}.`);
} else {
  const appDelegateHeaderImportStatement = '#import "AppDelegate.h"';
  appDelegateContents = appDelegateContents.replace(appDelegateHeaderImportStatement,
    `${appDelegateHeaderImportStatement}\n${firHeaderImportStatement}`);
}

// 4. Add to applicationDidFinishLaunchingWithOptions
const notificationCenterInitializationPatch = `
  [FIRApp configure];
  [[UNUserNotificationCenter currentNotificationCenter] setDelegate:self];
`;

if (~appDelegateContents.indexOf(notificationCenterInitializationPatch)) {
  console.log(`notificationCenterInitializationPatch already set in ${appDelegatePath}.`);
} else {
  const appDidFinishMark = '//NativeModuleInjectionMark-appDelegate-applicationDidFinishLaunchingWithOptions';
  appDelegateContents = appDelegateContents.replace(appDidFinishMark,
    `${appDidFinishMark}\n${notificationCenterInitializationPatch}`);
}

// 5. Add methods to app delegate body
const addMethodsPatch = `
- (void)userNotificationCenter:(UNUserNotificationCenter *)center willPresentNotification:(UNNotification *)notification withCompletionHandler:(void (^)(UNNotificationPresentationOptions))completionHandler
{
  [RNFIRMessaging willPresentNotification:notification withCompletionHandler:completionHandler];
}

#if defined(__IPHONE_11_0)
- (void)userNotificationCenter:(UNUserNotificationCenter *)center didReceiveNotificationResponse:(UNNotificationResponse *)response withCompletionHandler:(void (^)(void))completionHandler
{
  [RNFIRMessaging didReceiveNotificationResponse:response withCompletionHandler:completionHandler];
}
#else
- (void)userNotificationCenter:(UNUserNotificationCenter *)center didReceiveNotificationResponse:(UNNotificationResponse *)response withCompletionHandler:(void(^)())completionHandler
{
  [RNFIRMessaging didReceiveNotificationResponse:response withCompletionHandler:completionHandler];
}
#endif

-(void)application:(UIApplication *)application didReceiveLocalNotification:(UILocalNotification *)notification {
  [RNFIRMessaging didReceiveLocalNotification:notification];
}

- (void)application:(UIApplication *)application didReceiveRemoteNotification:(nonnull NSDictionary *)userInfo fetchCompletionHandler:(nonnull void (^)(UIBackgroundFetchResult))completionHandler{
  [RNFIRMessaging didReceiveRemoteNotification:userInfo fetchCompletionHandler:completionHandler];
}
`;

if (~appDelegateContents.indexOf(addMethodsPatch)) {
  console.log(`addMethodsPatch already set in ${appDelegatePath}.`);
} else {
  const appDelegateBodyMark = '//NativeModuleInjectionMark-appDelegate-body';
  appDelegateContents = appDelegateContents.replace(appDelegateBodyMark,
    `${appDelegateBodyMark}\n${addMethodsPatch}`);
}

fs.writeFileSync(appDelegateHeaderPath, appDelegateHeaderContents);
fs.writeFileSync(appDelegatePath, appDelegateContents);
