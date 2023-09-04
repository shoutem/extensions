const PERMISSION_TYPES = {
  ANDROID_ACCEPT_HANDOVER: 'android.permission.ACCEPT_HANDOVER',
  ANDROID_ACCESS_BACKGROUND_LOCATION:
    'android.permission.ACCESS_BACKGROUND_LOCATION',
  ANDROID_ACCESS_COARSE_LOCATION: 'android.permission.ACCESS_COARSE_LOCATION',
  ANDROID_ACCESS_FINE_LOCATION: 'android.permission.ACCESS_FINE_LOCATION',
  ANDROID_ACTIVITY_RECOGNITION: 'android.permission.ACTIVITY_RECOGNITION',
  ANDROID_ADD_VOICEMAIL: 'android.permission.ADD_VOICEMAIL',
  ANDROID_ANSWER_PHONE_CALLS: 'android.permission.ANSWER_PHONE_CALLS',
  ANDROID_BODY_SENSORS: 'android.permission.BODY_SENSORS',
  ANDROID_CALL_PHONE: 'android.permission.CALL_PHONE',
  ANDROID_CAMERA: 'android.permission.CAMERA',
  ANDROID_GET_ACCOUNTS: 'android.permission.GET_ACCOUNTS',
  ANDROID_PROCESS_OUTGOING_CALLS: 'android.permission.PROCESS_OUTGOING_CALLS',
  ANDROID_READ_CALENDAR: 'android.permission.READ_CALENDAR',
  ANDROID_READ_CALL_LOG: 'android.permission.READ_CALL_LOG',
  ANDROID_READ_CONTACTS: 'android.permission.READ_CONTACTS',
  ANDROID_READ_EXTERNAL_STORAGE: 'android.permission.READ_EXTERNAL_STORAGE',
  ANDROID_READ_PHONE_NUMBERS: 'android.permission.READ_PHONE_NUMBERS',
  ANDROID_READ_PHONE_STATE: 'android.permission.READ_PHONE_STATE',
  ANDROID_READ_SMS: 'android.permission.READ_SMS',
  ANDROID_RECEIVE_MMS: 'android.permission.RECEIVE_MMS',
  ANDROID_RECEIVE_SMS: 'android.permission.RECEIVE_SMS',
  ANDROID_RECEIVE_WAP_PUSH: 'android.permission.RECEIVE_WAP_PUSH',
  ANDROID_RECORD_AUDIO: 'android.permission.RECORD_AUDIO',
  ANDROID_SEND_SMS: 'android.permission.SEND_SMS',
  ANDROID_USE_SIP: 'android.permission.USE_SIP',
  ANDROID_WRITE_CALENDAR: 'android.permission.WRITE_CALENDAR',
  ANDROID_WRITE_CALL_LOG: 'android.permission.WRITE_CALL_LOG',
  ANDROID_WRITE_CONTACTS: 'android.permission.WRITE_CONTACTS',
  ANDROID_WRITE_EXTERNAL_STORAGE: 'android.permission.WRITE_EXTERNAL_STORAGE',
  IOS_APP_TRACKING_TRANSPARENCY: 'ios.permission.IOS_APP_TRACKING_TRANSPARENCY',
  IOS_BLUETOOTH_PERIPHERAL: 'ios.permission.BLUETOOTH_PERIPHERAL',
  IOS_CALENDARS: 'ios.permission.CALENDARS',
  IOS_CONTACTS: 'ios.permission.CONTACTS',
  IOS_CAMERA: 'ios.permission.CAMERA',
  IOS_FACE_ID: 'ios.permission.FACE_ID',
  IOS_LOCATION_ALWAYS: 'ios.permission.LOCATION_ALWAYS',
  IOS_LOCATION_WHEN_IN_USE: 'ios.permission.LOCATION_WHEN_IN_USE',
  IOS_MICROPHONE: 'ios.permission.MICROPHONE',
  IOS_MEDIA_LIBRARY: 'ios.permission.MEDIA_LIBRARY',
  IOS_MOTION: 'ios.permission.MOTION',
  IOS_PHOTO_LIBRARY: 'ios.permission.PHOTO_LIBRARY',
  IOS_PHOTO_LIBRARY_ADD_ONLY: 'ios.permission.PHOTO_LIBRARY_ADD_ONLY',
  IOS_REMINDERS: 'ios.permission.REMINDERS',
  IOS_SIRI: 'ios.permission.SIRI',
  IOS_SPEECH_RECOGNITION: 'ios.permission.SPEECH_RECOGNITION',
  IOS_STOREKIT: 'ios.permission.STOREKIT',

  // Following permissions do not need the actual prompt. We expand the library's list
  // with these in order to support AndroidManifest.xml modifications or Podfile injection
  // outside other extensions

  IOS_LOCATION_ALWAYS_AND_WHEN_IN_USE:
    'ios.permission.LOCATION_ALWAYS_AND_WHEN_IN_USE',
  IOS_NOTIFICATIONS: 'ios.permission.NOTIFICATIONS',
  ANDROID_INTERNET: 'android.permission.INTERNET',
  ANDROID_BLUETOOTH: 'android.permission.BLUETOOTH',
  ANDROID_FOREGROUND_SERVICE: 'android.permission.FOREGROUND_SERVICE',
  ANDROID_ACCESS_NETWORK_STATE: 'android.permission.ACCESS_NETWORK_STATE',
  ANDROID_BILLING: 'com.android.vending.BILLING',
  ANDROID_EXACT_ALARM: 'android.permission.SCHEDULE_EXACT_ALARM',
};

const IOS_PERMISSION_NATIVE_DATA = {
  [PERMISSION_TYPES.IOS_APP_TRACKING_TRANSPARENCY]: {
    name: 'AppTrackingTransparency',
    plistKey: 'NSUserTrackingUsageDescription',
  },
  [PERMISSION_TYPES.IOS_BLUETOOTH_PERIPHERAL]: {
    name: 'BluetoothPeripheral',
    plistKey: 'NSBluetoothPeripheralUsageDescription',
  },
  [PERMISSION_TYPES.IOS_CALENDARS]: {
    name: 'Calendars',
    plistKey: 'NSCalendarsUsageDescription',
  },
  [PERMISSION_TYPES.IOS_CONTACTS]: {
    name: 'Contacts',
    plistKey: 'NSContactsUsageDescription',
  },
  [PERMISSION_TYPES.IOS_CAMERA]: {
    name: 'Camera',
    plistKey: 'NSCameraUsageDescription',
  },
  [PERMISSION_TYPES.IOS_FACE_ID]: {
    name: 'FaceID',
    plistKey: 'NSFaceIDUsageDescription',
  },
  [PERMISSION_TYPES.IOS_LOCATION_ALWAYS]: {
    name: 'LocationAlways',
    plistKey: 'NSLocationAlwaysUsageDescription',
  },
  [PERMISSION_TYPES.IOS_LOCATION_WHEN_IN_USE]: {
    name: 'LocationWhenInUse',
    plistKey: 'NSLocationWhenInUseUsageDescription',
  },
  [PERMISSION_TYPES.IOS_LOCATION_ALWAYS_AND_WHEN_IN_USE]: {
    plistKey: 'NSLocationAlwaysAndWhenInUseUsageDescription',
  },
  [PERMISSION_TYPES.IOS_MICROPHONE]: {
    name: 'Microphone',
    plistKey: 'NSMicrophoneUsageDescription',
  },
  [PERMISSION_TYPES.IOS_MEDIA_LIBRARY]: {
    name: 'MediaLibrary',
    plistKey: 'NSAppleMusicUsageDescription',
  },
  [PERMISSION_TYPES.IOS_MOTION]: {
    name: 'Motion',
    plistKey: 'NSMotionUsageDescription',
  },
  [PERMISSION_TYPES.IOS_PHOTO_LIBRARY]: {
    name: 'PhotoLibrary',

    plistKey: 'NSPhotoLibraryUsageDescription',
  },
  [PERMISSION_TYPES.IOS_PHOTO_LIBRARY_ADD_ONLY]: {
    name: 'PhotoLibraryAddOnly',
    plistKey: 'NSPhotoLibraryAddUsageDescription',
  },
  [PERMISSION_TYPES.IOS_REMINDERS]: {
    name: 'Reminders',
    plistKey: 'NSRemindersUsageDescription',
  },
  [PERMISSION_TYPES.IOS_SIRI]: {
    name: 'Siri',
    plistKey: 'NSSiriUsageDescription',
  },
  [PERMISSION_TYPES.IOS_SPEECH_RECOGNITION]: {
    name: 'SpeechRecognition',
    plistKey: 'NSSpeechRecognitionUsageDescription',
  },
  [PERMISSION_TYPES.IOS_STOREKIT]: {
    name: 'StoreKit',
    plistKey: 'NSAppleMusicUsageDescription',
  },
  [PERMISSION_TYPES.IOS_NOTIFICATIONS]: {
    name: 'Notifications',
  },
};

const ANDROID_PERMISSION_NATIVE_DATA = {
  [PERMISSION_TYPES.ANDROID_ACCEPT_HANDOVER]:
    '<uses-permission android:name="android.permission.ACCEPT_HANDOVER" />',
  [PERMISSION_TYPES.ANDROID_ACCESS_BACKGROUND_LOCATION]:
    '<uses-permission android:name="android.permission.ACCESS_BACKGROUND_LOCATION" />',
  [PERMISSION_TYPES.ANDROID_ACCESS_COARSE_LOCATION]:
    '<uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />',
  [PERMISSION_TYPES.ANDROID_ACCESS_FINE_LOCATION]:
    '<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />',
  [PERMISSION_TYPES.ANDROID_ACTIVITY_RECOGNITION]:
    '<uses-permission android:name="android.permission.ACTIVITY_RECOGNITION" />',
  [PERMISSION_TYPES.ANDROID_ADD_VOICEMAIL]:
    '<uses-permission android:name="com.android.voicemail.permission.ADD_VOICEMAIL" />',
  [PERMISSION_TYPES.ANDROID_ANSWER_PHONE_CALLS]:
    '<uses-permission android:name="android.permission.ANSWER_PHONE_CALLS" />',
  [PERMISSION_TYPES.ANDROID_BODY_SENSORS]:
    '<uses-permission android:name="android.permission.BODY_SENSORS" />',
  [PERMISSION_TYPES.ANDROID_CALL_PHONE]:
    '<uses-permission android:name="android.permission.CALL_PHONE" />',
  [PERMISSION_TYPES.ANDROID_CAMERA]:
    '<uses-permission android:name="android.permission.CAMERA" />',
  [PERMISSION_TYPES.ANDROID_GET_ACCOUNTS]:
    '<uses-permission android:name="android.permission.GET_ACCOUNTS" />',
  [PERMISSION_TYPES.ANDROID_PROCESS_OUTGOING_CALLS]:
    '<uses-permission android:name="android.permission.PROCESS_OUTGOING_CALLS" />',
  [PERMISSION_TYPES.ANDROID_READ_CALENDAR]:
    '<uses-permission android:name="android.permission.READ_CALENDAR" />',
  [PERMISSION_TYPES.ANDROID_READ_CALL_LOG]:
    '<uses-permission android:name="android.permission.READ_CALL_LOG" />',
  [PERMISSION_TYPES.ANDROID_READ_CONTACTS]:
    '<uses-permission android:name="android.permission.READ_CONTACTS" />',
  [PERMISSION_TYPES.ANDROID_READ_EXTERNAL_STORAGE]:
    '<uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />',
  [PERMISSION_TYPES.ANDROID_READ_PHONE_NUMBERS]:
    '<uses-permission android:name="android.permission.READ_PHONE_NUMBERS" />',
  [PERMISSION_TYPES.ANDROID_READ_PHONE_STATE]:
    '<uses-permission android:name="android.permission.READ_PHONE_STATE" />',
  [PERMISSION_TYPES.ANDROID_READ_SMS]:
    '<uses-permission android:name="android.permission.READ_SMS" />',
  [PERMISSION_TYPES.ANDROID_RECEIVE_MMS]:
    '<uses-permission android:name="android.permission.RECEIVE_MMS" />',
  [PERMISSION_TYPES.ANDROID_RECEIVE_SMS]:
    '<uses-permission android:name="android.permission.RECEIVE_SMS" />',
  [PERMISSION_TYPES.ANDROID_RECEIVE_WAP_PUSH]:
    '<uses-permission android:name="android.permission.RECEIVE_WAP_PUSH" />',
  [PERMISSION_TYPES.ANDROID_RECORD_AUDIO]:
    '<uses-permission android:name="android.permission.RECORD_AUDIO" />',
  [PERMISSION_TYPES.ANDROID_SEND_SMS]:
    '<uses-permission android:name="android.permission.SEND_SMS" />',
  [PERMISSION_TYPES.ANDROID_USE_SIP]:
    '<uses-permission android:name="android.permission.USE_SIP" />',
  [PERMISSION_TYPES.ANDROID_WRITE_CALENDAR]:
    '<uses-permission android:name="android.permission.WRITE_CALENDAR" />',
  [PERMISSION_TYPES.ANDROID_WRITE_CALL_LOG]:
    '<uses-permission android:name="android.permission.WRITE_CALL_LOG" />',
  [PERMISSION_TYPES.ANDROID_WRITE_CONTACTS]:
    '<uses-permission android:name="android.permission.WRITE_CONTACTS" />',
  [PERMISSION_TYPES.ANDROID_WRITE_EXTERNAL_STORAGE]:
    '<uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" android:maxSdkVersion="28" />',
  [PERMISSION_TYPES.ANDROID_INTERNET]:
    '<uses-permission android:name="android.permission.INTERNET" />',
  [PERMISSION_TYPES.ANDROID_BLUETOOTH]:
    '<uses-permission android:name="android.permission.BLUETOOTH"/>',
  [PERMISSION_TYPES.ANDROID_FOREGROUND_SERVICE]:
    '<uses-permission android:name="android.permission.FOREGROUND_SERVICE" />',
  [PERMISSION_TYPES.ANDROID_ACCESS_NETWORK_STATE]:
    '<uses-permission android:name="android.permission.ACCESS_NETWORK_STATE"/>',
  [PERMISSION_TYPES.ANDROID_BILLING]:
    '<uses-permission android:name="com.android.vending.BILLING" />',
  [PERMISSION_TYPES.ANDROID_EXACT_ALARM]:
    '<uses-permission android:name="android.permission.SCHEDULE_EXACT_ALARM"/>',
};

const PERMISSION_IOS_RATIONALE_PREFIX = {
  [PERMISSION_TYPES.IOS_APP_TRACKING_TRANSPARENCY]:
    'This app will track your data to',
  [PERMISSION_TYPES.IOS_BLUETOOTH_PERIPHERAL]:
    'This app needs to use bluetooth to',
  [PERMISSION_TYPES.IOS_CALENDARS]:
    'This app needs to access your calendar data to',
  [PERMISSION_TYPES.IOS_CONTACTS]: 'This app needs access to your content to',
  [PERMISSION_TYPES.IOS_CAMERA]: 'This app needs access to your camera to',
  [PERMISSION_TYPES.IOS_FACE_ID]: 'This app needs to use face ID to',
  [PERMISSION_TYPES.IOS_LOCATION_ALWAYS_AND_WHEN_IN_USE]:
    'This app needs access to your location to',
  [PERMISSION_TYPES.IOS_LOCATION_ALWAYS]:
    'This app needs access to your location to',
  [PERMISSION_TYPES.IOS_LOCATION_WHEN_IN_USE]:
    'This app needs access to your location to',
  [PERMISSION_TYPES.IOS_MICROPHONE]: 'This app needs to use your microphone to',
  [PERMISSION_TYPES.IOS_MEDIA_LIBRARY]:
    'This app needs access to your media library to',
  [PERMISSION_TYPES.IOS_MOTION]: 'This app needs to use your motion sensors to',
  [PERMISSION_TYPES.IOS_PHOTO_LIBRARY]:
    'This app needs access to your photo library to',
  [PERMISSION_TYPES.IOS_PHOTO_LIBRARY_ADD_ONLY]:
    'This app needs permission to add to your photo library, to',
  [PERMISSION_TYPES.IOS_REMINDERS]:
    'This app needs access to your reminders to',
  [PERMISSION_TYPES.IOS_SIRI]: 'This app needs access to Siri to',
  [PERMISSION_TYPES.IOS_SPEECH_RECOGNITION]:
    'This app needs access to speech recognition to',
  [PERMISSION_TYPES.IOS_STOREKIT]: 'This app needs access to StoreKit to',
};

module.exports = {
  PERMISSION_TYPES,
  IOS_PERMISSION_NATIVE_DATA,
  ANDROID_PERMISSION_NATIVE_DATA,
  PERMISSION_IOS_RATIONALE_PREFIX,
};
