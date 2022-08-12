const {
  ANCHORS,
  getRootGradlePath,
  getMainApplicationPath,
  inject,
  projectPath,
  getAppGradlePath,
  getGradleConstantsPath,
  getAndroidManifestPath,
  fetchPublishingProperties,
  getBuildConfiguration,
  replace,
} = require('@shoutem/build-tools');
const _ = require('lodash');
const fs = require('fs-extra');
const path = require('path');
require('colors');

const androidRepositoryInjection =
  'maven { url "https://salesforce-marketingcloud.github.io/MarketingCloudSDK-Android/repository" }';
const androidAppplicationImportInjection = `
import com.salesforce.marketingcloud.MarketingCloudConfig;
import com.salesforce.marketingcloud.MarketingCloudSdk;
import com.salesforce.marketingcloud.notifications.NotificationCustomizationOptions;
import android.util.Log;`;
const androidGradleDependencyImport = `implementation 'com.salesforce.marketingcloud:marketingcloudsdk:8.0.1'`;
const messagingServiceString = `android:name="com.dieam.reactnativepushnotification.modules.RNPushNotificationListenerService"`;
const messagingServiceReplace = `android:name=".CustomPushService"`;
const marketingCloudVersion = "marketingCloudVersion = '8.0.1'";

function getCustomPushServicePath() {
  return path.resolve(
    projectPath,
    'android/app/src/main/java/com/shoutemapp/CustomPushService.java',
  );
}

function isProduction() {
  const buildConfig = getBuildConfiguration();

  return buildConfig && buildConfig.production;
}

function createMainApplicationInjection(
  appId,
  accessToken,
  serverUrl,
  FCMSenderId,
) {
  return `MarketingCloudSdk.init(this,
    MarketingCloudConfig.builder()
            .setApplicationId("${appId}")
            .setAccessToken("${accessToken}")
            .setSenderId("${FCMSenderId}")
            .setMarketingCloudServerUrl("${serverUrl}")
            .setNotificationCustomizationOptions(NotificationCustomizationOptions.create(R.mipmap.app_icon))
            .setAnalyticsEnabled(true)
            .build(this),
    initializationStatus -> Log.e("INIT", initializationStatus.toString()));`;
}

function createCustomPushServiceContent(appBundle) {
  return `package ${appBundle};

  import com.salesforce.marketingcloud.MarketingCloudSdk;
  import com.salesforce.marketingcloud.messages.push.PushMessageManager;
  import com.dieam.reactnativepushnotification.modules.RNPushNotificationListenerService;

  import com.google.firebase.messaging.RemoteMessage;

  public class CustomPushService extends RNPushNotificationListenerService {
      @Override
      public void onMessageReceived(RemoteMessage remoteMessage) {
        if (PushMessageManager.isMarketingCloudPush(remoteMessage)) {
          MarketingCloudSdk.requestSdk(sdk -> sdk.getPushMessageManager().handleMessage(remoteMessage));
        } else {
          super.onMessageReceived(remoteMessage);
        }
      }

      @Override
      public void onNewToken(String token) {
        MarketingCloudSdk.requestSdk(sdk -> sdk.getPushMessageManager().setPushToken(token));

        super.onNewToken(token);
      }
  }
  `;
}

const getExtensionSettings = appConfiguration => {
  const includedResources = _.get(appConfiguration, 'included');
  const extension = _.find(includedResources, {
    type: 'shoutem.core.extensions',
    id: 'shoutem.salesforce',
  });

  return _.get(extension, 'attributes.settings');
};

async function injectAndroid(appConfiguration) {
  const extSettings = getExtensionSettings(appConfiguration);
  const { appId, accessToken, appEndpoint, fcmSenderId } = extSettings;

  const isValidConfiguration =
    !!appId && !!accessToken && !!appEndpoint && !!fcmSenderId;

  const injectionString = createMainApplicationInjection(
    appId,
    accessToken,
    appEndpoint,
    fcmSenderId,
  );
  const rootGradlePath = getRootGradlePath({ cwd: projectPath });
  const mainApplicationPath = getMainApplicationPath({ cwd: projectPath });
  const appGradlePath = getAppGradlePath({ cwd: projectPath });
  const androidManifestPath = getAndroidManifestPath({ cwd: projectPath });
  const pushServicePath = getCustomPushServicePath();
  const gradleConstantsPath = getGradleConstantsPath({ cwd: projectPath });

  inject(
    rootGradlePath,
    ANCHORS.ANDROID.GRADLE.ROOT_GRADLE_ALLPROJECTS_REPOSITORIES,
    androidRepositoryInjection,
  );

  if (isValidConfiguration) {
    inject(
      mainApplicationPath,
      ANCHORS.ANDROID.MAIN_APPLICATION.ON_CREATE_END,
      injectionString,
    );
  } else {
    const message = `Faulty Marketing Cloud configuration. Please check if you defined all necessary params in Salesforce MC settings page: App id, Access token, App endpoint & FCM sender id`;
    // eslint-disable-next-line no-console
    console.warn(message.bold.yellow);
  }

  inject(
    mainApplicationPath,
    ANCHORS.ANDROID.MAIN_APPLICATION.IMPORT,
    androidAppplicationImportInjection,
  );
  inject(
    appGradlePath,
    ANCHORS.ANDROID.GRADLE.APP.DEPENDENCIES,
    androidGradleDependencyImport,
  );
  replace(androidManifestPath, messagingServiceString, messagingServiceReplace);
  inject(
    gradleConstantsPath,
    ANCHORS.ANDROID.GRADLE.CONSTANTS,
    marketingCloudVersion,
  );

  fs.ensureFileSync(pushServicePath);
  let bundleId;

  if (!isProduction()) {
    bundleId = 'com.shoutemapp';
  } else {
    const publishingProperties = await fetchPublishingProperties(
      getBuildConfiguration(),
    );
    bundleId = publishingProperties.android_market_package_name;
  }

  fs.writeFileSync(pushServicePath, createCustomPushServiceContent(bundleId));
  // eslint-disable-next-line no-console
  console.log('[shoutem.salesforce]: Created custom push activity');
}

module.exports = {
  injectAndroid,
};
