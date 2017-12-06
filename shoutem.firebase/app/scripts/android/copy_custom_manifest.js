/* eslint-disable max-len*/
'use_strict';

const fs = require('fs-extra');

const ANDROID_MANIFEST = 'android/app/src/main/AndroidManifest.xml';

const PERMISSIONS_REPLACEMENT_TAG = '<uses-permission android:name="android.permission.INTERNET" />';
const APPLICATION_REPLACEMENT_TAG = '<activity';

let androidManifest = fs.readFileSync(ANDROID_MANIFEST, 'utf8');

// add firebase permissions
const permissions = [
  '    <uses-permission android:name="android.permission.RECEIVE_BOOT_COMPLETED" />',
  '    <uses-permission android:name="android.permission.VIBRATE" />',
];

permissions.forEach(permission => {
  const permissionReplacement = `${permission}\n${PERMISSIONS_REPLACEMENT_TAG}`;
  androidManifest = androidManifest.replace(PERMISSIONS_REPLACEMENT_TAG, permissionReplacement);

  console.log(`[shoutem-firebase] - Adding ${permission} to AndroidManifest.xml`);
});

// add firebase services
const services = `
  <service android:name="com.evollu.react.fcm.MessagingService">
      <intent-filter>
          <action android:name="com.google.firebase.MESSAGING_EVENT"/>
      </intent-filter>
  </service>

  <service android:name="com.evollu.react.fcm.InstanceIdService" android:exported="false">
      <intent-filter>
          <action android:name="com.google.firebase.INSTANCE_ID_EVENT"/>
      </intent-filter>
  </service>
  <receiver android:name="com.evollu.react.fcm.FIRLocalMessagingPublisher"/>
  <receiver android:enabled="true" android:exported="true"  android:name="com.evollu.react.fcm.FIRSystemBootEventReceiver">
      <intent-filter>
          <action android:name="android.intent.action.BOOT_COMPLETED"/>
          <action android:name="android.intent.action.QUICKBOOT_POWERON"/>
          <action android:name="com.htc.intent.action.QUICKBOOT_POWERON"/>
          <category android:name="android.intent.category.DEFAULT" />
      </intent-filter>
  </receiver>
`;

const applicationReplacement = `${services}${APPLICATION_REPLACEMENT_TAG}`;
androidManifest = androidManifest.replace(APPLICATION_REPLACEMENT_TAG, applicationReplacement);
console.log('[shoutem-firebase] - Added services to AndroidManifest.xml');

fs.writeFileSync(ANDROID_MANIFEST, androidManifest, 'ascii');
