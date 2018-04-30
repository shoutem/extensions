const { reactNativeLink, forceLinkXCodeProject } = require('@shoutem/build-tools');

reactNativeLink('react-native-camera');

forceLinkXCodeProject({
  xcodeprojFileName: 'RCTCamera.xcodeproj',
  folderName: 'react-native-camera',
  podspec: 'react-native-camera',
});
