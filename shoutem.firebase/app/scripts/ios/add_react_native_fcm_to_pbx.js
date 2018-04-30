/**
 * This script exists because react-native link won't add the *.xcodeproj
 * and *.a files to the project.pbxproj if the module is already installed as a pod,
 * and react-native-fcm requires both, apparently.
 */

const { forceLinkXCodeProject } = require('@shoutem/build-tools');

forceLinkXCodeProject({
  xcodeprojFileName: 'RNFIRMessaging.xcodeproj',
  folderName: 'react-native-fcm',
  podspec: 'react-native-fcm',
});
