const { reactNativeLink, forceLinkXCodeProject } = require('@shoutem/build-tools');

reactNativeLink('react-native-svg');

forceLinkXCodeProject({
  xcodeprojFileName: 'RNSVG.xcodeproj',
  folderName: 'react-native-svg',
  podspec: 'RNSVG',
});
