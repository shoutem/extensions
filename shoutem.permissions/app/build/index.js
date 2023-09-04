require('colors');
const fs = require('fs-extra');
const _ = require('lodash');
const path = require('path');
const plist = require('plist');
const buildTools = require('shoutem.application/build');
const {
  ANCHORS,
  getAppConfiguration,
  inject,
  projectPath,
  getAndroidManifestPath,
} = require('@shoutem/build-tools');
const {
  IOS_PERMISSION_NATIVE_DATA,
  ANDROID_PERMISSION_NATIVE_DATA,
  PERMISSION_IOS_RATIONALE_PREFIX,
} = require('./const');
const { setupIosPermissions } = require('./setupIosPermissions');
const { name: extName } = require('../package.json');

const { getExtensionSettings } = buildTools.configuration;

const registeredPermissions = {};

function isIOSPermission(permission) {
  if (!permission.type) {
    return false;
  }

  const parts = _.split(permission.type, '.');

  return parts[0] === 'ios';
}

function overwriteRationales(appConfiguration) {
  const settings = getExtensionSettings(
    appConfiguration,
    'shoutem.permissions',
  );
  const { permissionsToOverwrite: permissionsToOverwriteText } = settings;

  if (!permissionsToOverwriteText) {
    return;
  }

  const permissionsToOverwrite = JSON.parse(permissionsToOverwriteText);

  for (const type of _.keys(permissionsToOverwrite)) {
    const permission = { type, rationale: permissionsToOverwrite[type] };

    if (registeredPermissions[type]) {
      // eslint-disable-next-line no-console
      console.log(`Overwriting permission rationale - ${type}`.bold.green);
      registeredPermissions[type] = {
        overwritten: true,
        type,
        rationale: permission.rationale,
        ...(isIOSPermission(permission) && IOS_PERMISSION_NATIVE_DATA[type]),
        ...(!isIOSPermission(permission) && {
          manifestString: ANDROID_PERMISSION_NATIVE_DATA[type],
        }),
      };
    } else {
      // eslint-disable-next-line no-console
      console.log(
        `Warning: can not overwrite permission rationale, ${type} permission does not exist.`
          .yellow,
      );
    }
  }
}

function injectPermissionsToPackageJson() {
  const packageJsonPath = path.join(projectPath, 'package.json');
  const rootPackageJson = fs.readJsonSync(packageJsonPath);

  if (_.isEmpty(registeredPermissions)) {
    return;
  }

  const iosPermissions = _.filter(registeredPermissions, isIOSPermission);

  if (_.isEmpty(iosPermissions)) {
    return;
  }

  rootPackageJson.reactNativePermissionsIOS = [];

  iosPermissions.forEach(permission => {
    rootPackageJson.reactNativePermissionsIOS.push(permission.name);
  });

  if (rootPackageJson.reactNativePermissionsIOS?.length) {
    fs.writeJsonSync(packageJsonPath, rootPackageJson, { spaces: 2 });
    // eslint-disable-next-line no-console
    console.log(
      `[${extName}]: Added IOS permissions to package.json:`,
      rootPackageJson.reactNativePermissionsIOS,
    );
  }
}

function parsePlist(plistPath) {
  let plistResult = {};

  if (fs.existsSync(plistPath)) {
    const plistContent = fs.readFileSync(plistPath, 'utf8');

    try {
      plistResult = plist.parse(plistContent);
    } catch (e) {
      // eslint-disable-next-line no-console
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

      // If rationale is overwritten by settings page, we don't want prefix
      const resolvedRationale = permission.overwritten
        ? permission.rationale
        : `${PERMISSION_IOS_RATIONALE_PREFIX[permission.type]}${
            permission.rationale
          }`;

      return {
        ...result,
        [permission.plistKey]: resolvedRationale,
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

function preBuild(appConfiguration) {
  const files = fs.readdirSync(`${projectPath}/extensions`);
  const withoutHiddenFiles = files.filter(
    // eslint-disable-next-line no-useless-escape
    item => !/(^|\/)\.[^\/\.]/g.test(item),
  );
  const extensions = _.without(withoutHiddenFiles, 'README.md', 'package.json');

  _.forEach(extensions, extension => {
    const permissionsFile = `${projectPath}/extensions/${extension}/app/permissions.js`;
    const hasFile = fs.existsSync(permissionsFile);

    if (hasFile) {
      const {
        permissions,
        // eslint-disable-next-line global-require, import/no-dynamic-require
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

  overwriteRationales(appConfiguration);
  injectPermissionsToPackageJson();
  setupIosPermissions();
  injectPlistPermissions();
  injectManifestPermissions();
}

function runPreBuild() {
  const appConfiguration = getAppConfiguration();
  preBuild(appConfiguration);
}

module.exports = {
  preBuild,
  runPreBuild,
};
