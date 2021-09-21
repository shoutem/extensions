const fs = require('fs-extra');
const _ = require('lodash');
const plist = require('plist');
const {
  ANCHORS,
  getPodfileTemplatePath,
  inject,
  projectPath,
  getAndroidManifestPath,
} = require('@shoutem/build-tools');
const {
  IOS_PERMISSION_NATIVE_DATA,
  ANDROID_PERMISSION_NATIVE_DATA,
  PERMISSION_IOS_RATIONALE_PREFIX,
} = require('./const');

const registeredPermissions = {};

function isIOSPermission(permission) {
  if (!permission.type) {
    return false;
  }

  const parts = _.split(permission.type, '.');

  return parts[0] === 'ios';
}

function injectPodfileData() {
  const podfileTemplatePath = getPodfileTemplatePath({ cwd: projectPath });

  _.forEach(registeredPermissions, permission => {
    if (isIOSPermission(permission) && permission.pod && permission.podPath) {
      const injectedString = `pod '${permission.pod}', :path => "${permission.podPath}"`;

      inject(
        podfileTemplatePath,
        ANCHORS.IOS.PODFILE.EXTENSION_DEPENDENCIES,
        injectedString,
      );
    }
  });
}

function parsePlist(plistPath) {
  let plistResult = {};

  if (fs.existsSync(plistPath)) {
    const plistContent = fs.readFileSync(plistPath, 'utf8');

    try {
      plistResult = plist.parse(plistContent);
    } catch (e) {
      console.error('Unable to parse plist', plistPath);
    }
  }

  return plistResult;
}

function injectPlistPermissions() {
  const plistPath = 'ios/Info.plist';
  const currentPlistContents = parsePlist(plistPath);

  const newPlistData = _.reduce(
    registeredPermissions,
    (result, permission) => {
      if (!isIOSPermission(permission) || !permission.plistKey) {
        return result;
      }

      return {
        ...result,
        [permission.plistKey]: `${PERMISSION_IOS_RATIONALE_PREFIX[permission.type]
          }${permission.rationale}`,
      };
    },
    {},
  );

  const finalPlist = Object.assign(currentPlistContents, newPlistData);

  fs.writeFileSync(plistPath, plist.build(finalPlist));
}

function injectManifestPermissions() {
  const manifestPath = getAndroidManifestPath({ cwd: projectPath });

  _.forEach(registeredPermissions, permission => {
    if (!isIOSPermission(permission)) {
      inject(
        manifestPath,
        ANCHORS.ANDROID.MANIFEST.ROOT,
        permission.manifestString,
      );
    }
  });
}

function preBuild() {
  const files = fs.readdirSync(`${projectPath}/extensions`);
  const withoutHiddenFiles = files.filter(
    item => !/(^|\/)\.[^\/\.]/g.test(item),
  );
  const extensions = _.without(withoutHiddenFiles, 'README.md', 'package.json');

  _.forEach(extensions, extension => {
    const permissionsFile = `${projectPath}/extensions/${extension}/app/permissions.js`;
    const hasFile = fs.existsSync(permissionsFile);

    if (hasFile) {
      const {
        permissions,
      } = require(`${projectPath}/extensions/${extension}/app/permissions.js`);
      _.forEach(permissions, permission => {
        const currentRationale = _.get(
          registeredPermissions[permission.type],
          'rationale',
        );

        const calculatedRationale = currentRationale
          ? `${currentRationale}, ${permission.rationale}`
          : ` ${permission.rationale}`;

        registeredPermissions[permission.type] = {
          type: permission.type,
          rationale: calculatedRationale,
          ...(isIOSPermission(permission) &&
            IOS_PERMISSION_NATIVE_DATA[permission.type]),
          ...(!isIOSPermission(permission) && {
            manifestString: ANDROID_PERMISSION_NATIVE_DATA[permission.type],
          }),
        };
      });
    }
  });

  injectPodfileData();
  injectPlistPermissions();
  injectManifestPermissions();
}

module.exports = {
  preBuild,
  runPreBuild: preBuild,
};
