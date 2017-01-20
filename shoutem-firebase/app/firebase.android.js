import firebase from 'react-native-fcm';

export default {
  ...firebase,
  requestPermissions: console.log.bind(null, 'Request permissions not available on Android'),
  setBadgeNumber: console.log.bind(null, 'Setting a badge number not available on Android'),
};
