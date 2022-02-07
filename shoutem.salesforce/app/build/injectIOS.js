const {
  ANCHORS,
  getAppDelegatePath,
  inject,
  projectPath,
  replace,
} = require('@shoutem/build-tools');
const _ = require('lodash');

const iosAppDelegateImport = '#import <MarketingCloudSDK/MarketingCloudSDK.h>';
const didRegisterForNotificationsString = `- (void)application:(UIApplication *)application didRegisterForRemoteNotificationsWithDeviceToken:(NSData *)deviceToken
{`;
const didRegisterForNotificationsReplace = `- (void)application:(UIApplication *)application didRegisterForRemoteNotificationsWithDeviceToken:(NSData *)deviceToken
{
  [[MarketingCloudSDK sharedInstance] sfmc_setDeviceToken:deviceToken];`;
const didReceiveRemoteNotificationString = `- (void)application:(UIApplication *)application didReceiveRemoteNotification:(NSDictionary *)userInfo
fetchCompletionHandler:(void (^)(UIBackgroundFetchResult))completionHandler
{`;
const didReceiveRemoteNotificationReplace = `- (void)application:(UIApplication *)application didReceiveRemoteNotification:(NSDictionary *)userInfo
fetchCompletionHandler:(void (^)(UIBackgroundFetchResult))completionHandler
{
  [[MarketingCloudSDK sharedInstance] sfmc_setNotificationUserInfo:userInfo];`;
const userNotificationCenterString = `- (void)userNotificationCenter:(UNUserNotificationCenter *)center
didReceiveNotificationResponse:(UNNotificationResponse *)response
         withCompletionHandler:(void (^)(void))completionHandler
{`;
const userNotificationCenterReplace = `- (void)userNotificationCenter:(UNUserNotificationCenter *)center
didReceiveNotificationResponse:(UNNotificationResponse *)response
         withCompletionHandler:(void (^)(void))completionHandler
{
  [[MarketingCloudSDK sharedInstance] sfmc_setNotificationRequest:response.notification.request];`;

function createAppDelegateInjection(appId, accessToken, serverUrl) {
  return `MarketingCloudSDKConfigBuilder *mcsdkBuilder = [MarketingCloudSDKConfigBuilder new];
  [mcsdkBuilder sfmc_setApplicationId:@"${appId}"];
  [mcsdkBuilder sfmc_setAccessToken:@"${accessToken}"];
  [mcsdkBuilder sfmc_setAnalyticsEnabled:@(YES)];
  [mcsdkBuilder sfmc_setMarketingCloudServerUrl:@"${serverUrl}"];

  NSError *error = nil;
  BOOL success =
      [[MarketingCloudSDK sharedInstance] sfmc_configureWithDictionary:[mcsdkBuilder sfmc_build]
                                                                 error:&error];`;
}

const getExtensionSettings = appConfiguration => {
  const includedResources = _.get(appConfiguration, 'included');
  const extension = _.find(includedResources, {
    type: 'shoutem.core.extensions',
    id: 'shoutem.salesforce',
  });

  return _.get(extension, 'attributes.settings');
};

function injectIOS(appConfiguration) {
  const extSettings = getExtensionSettings(appConfiguration);
  const { appId, accessToken, appEndpoint } = extSettings;

  const injectionString = createAppDelegateInjection(
    appId,
    accessToken,
    appEndpoint,
  );
  const appDelegatePath = getAppDelegatePath({ cwd: projectPath });

  inject(
    appDelegatePath,
    ANCHORS.IOS.APP_DELEGATE.IMPORT,
    iosAppDelegateImport,
  );
  inject(
    appDelegatePath,
    ANCHORS.IOS.APP_DELEGATE.DID_FINISH_LAUNCHING_WITH_OPTIONS_END,
    injectionString,
  );
  replace(
    appDelegatePath,
    didRegisterForNotificationsString,
    didRegisterForNotificationsReplace,
  );
  replace(
    appDelegatePath,
    didReceiveRemoteNotificationString,
    didReceiveRemoteNotificationReplace,
  );
  replace(
    appDelegatePath,
    userNotificationCenterString,
    userNotificationCenterReplace,
  );
}

module.exports = {
  injectIOS,
};
