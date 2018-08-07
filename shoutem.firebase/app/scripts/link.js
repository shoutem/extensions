const { reactNativeLink } = require('@shoutem/build-tools');
const { injectFirebase } = require('../build/injectFirebase');

reactNativeLink('react-native-fcm');
injectFirebase();
