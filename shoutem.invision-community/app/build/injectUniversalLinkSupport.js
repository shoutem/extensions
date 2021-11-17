const {
  ANCHORS,
  getAppDelegatePath,
  inject,
  projectPath,
} = require('@shoutem/build-tools');

const openUrlCode = `
- (BOOL)application:(UIApplication *)application continueUserActivity:(nonnull NSUserActivity *)userActivity
restorationHandler:(nonnull void (^)(NSArray<id<UIUserActivityRestoring>> * _Nullable))restorationHandler
{
return [RCTLinkingManager application:application
                continueUserActivity:userActivity
                  restorationHandler:restorationHandler];
}
`;

function injectUniversalLinkSupport() {
  // AppDelegate.m mods
  const appDelegatePath = getAppDelegatePath({ cwd: projectPath });
  inject(appDelegatePath, ANCHORS.IOS.APP_DELEGATE.BODY, openUrlCode);
}

module.exports = injectUniversalLinkSupport;
