import pack from './package.json';

// defines scope for the current extension state within the global app's state
export function ext(resourceName) {
  return resourceName ? `${pack.name}.${resourceName}` : pack.name;
}

export const ALARM_PERMISSION_STATUSES = {
  GRANTED: 'GRANTED',
  DENIED: 'DENIED',
  UNKNOWN: 'UNKNOWN',
};

export const PERMISSION_RESULT_TYPES = {
  UNAVAILABLE: 'unavailable',
  BLOCKED: 'blocked',
  DENIED: 'denied',
  GRANTED: 'granted',
  LIMITED: 'limited',
};

export const PERMISSION_TYPES = {
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
};
