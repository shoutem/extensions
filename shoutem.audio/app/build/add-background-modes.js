const _ = require('lodash');
const fs = require('fs-extra');
const plist = require('plist');

function parsePlist(plistPath) {
  let plistResult = {};

  if (!fs.existsSync(plistPath)) {
    console.log(`No path found on ${plistPath}`);
    return null;
  }

  const plistContent = fs.readFileSync(plistPath, 'utf8');

  try {
    plistResult = plist.parse(plistContent);
  } catch (e) {
    console.error('Unable to parse plist', plistPath);
  }

  return plistResult;
}

function hasTrackPlayingShortcut(configuration) {
  const hasTrackPlayingShortcut = configuration.included.find(item => {
    const isShortcut = item.type === 'shoutem.core.shortcuts';

    if (!isShortcut) {
      return false;
    }

    const canonicalName = _.get(item, 'attributes.canonicalName', '');

    return (
      canonicalName.includes('Radio') ||
      canonicalName.includes('podcast-shortcut')
    );
  });

  return hasTrackPlayingShortcut;
}

/**
 * If radio or podcast shortcut is present, writes the required background
 * mode into extension's Info.plist file
 */
function updateInfoPlist(appConfiguration) {
  if (!hasTrackPlayingShortcut(appConfiguration)) {
    return;
  }

  console.log(
    '[shoutem.audio] - Adding audio background mode to extension Info.plist',
  );

  const plistPath = 'ios/Info.plist';
  const currentPlistContents = parsePlist(plistPath);
  const backgroundModePlistData = {
    UIBackgroundModes: ['audio'],
  };

  const audioInfoPlist = Object.assign(
    currentPlistContents,
    backgroundModePlistData,
  );

  fs.writeFileSync(plistPath, plist.build(audioInfoPlist));
}

module.exports = {
  updateInfoPlist,
};
