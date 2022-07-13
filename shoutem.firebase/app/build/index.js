/* eslint-disable quotes,max-len,no-console */
const _ = require('lodash');
const fs = require('fs-extra');
const path = require('path');
const request = require('request');
const URI = require('urijs');
const glob = require('glob');
const xcode = require('xcode');
require('colors');
const { projectPath } = require('@shoutem/build-tools');
const {
  getAppConfiguration,
  getBuildConfiguration,
} = require('@shoutem/build-tools');
const { injectFirebase } = require('./injectFirebase');
const { injectReactNativePush } = require('./injectReactNativePush');
const { injectFirebaseSettingsFile } = require('./injectFirebaseSettingsFile');
const { name: firebaseExtensionName } = require('../package.json');

const extensionPath = `${projectPath}/node_modules/shoutem.firebase`;

function endpointForResource(uri, appId, res) {
  return `${uri}${appId}/firebase/objects/FirebaseProject/${res}`;
}

function resolveFcmFiles(uri, appId) {
  return [
    {
      filename: 'google-services.json',
      endpoint: endpointForResource(uri, appId, 'googleservices.json'),
    },
    {
      filename: 'GoogleService-Info.plist',
      endpoint: endpointForResource(uri, appId, 'googleservices.plist'),
    },
  ];
}

function download(url, path, callback) {
  const file = fs.createWriteStream(path);

  request
    .get(url, (err, res, data) => {
      if (_.isEmpty(data)) {
        console.log(
          `Received empty response from\n${url}\n>>> Please check your shoutem.firebase settings! <<<`,
        );

        fs.unlinkSync(path);
        if (callback) {
          callback(false);
        }

        return;
      }

      callback(true);
    })
    .on('error', () => {
      fs.unlinkSync(path);

      if (callback) {
        callback(false);
      }
    })
    .pipe(file)
    .on('finish', () => {
      file.close(null);
    });
}

function downloadConfigurationFile({ endpoint, filename }) {
  return new Promise(resolve => {
    download(endpoint, filename, success => {
      if (!success) {
        return resolve(false);
      }

      console.log(`Downloaded ${filename} from ${endpoint}`);
      return resolve(true);
    });
  });
}

function downloadConfigurationFiles(legacyApi, appId) {
  const uri = new URI(legacyApi).protocol('http').toString();
  const fcmFiles = resolveFcmFiles(uri, appId);

  return Promise.all(fcmFiles.map(downloadConfigurationFile));
}

function isFirebaseExtension(data) {
  return (
    data.type === 'shoutem.core.extensions' && data.id === firebaseExtensionName
  );
}

function resolveConfigFilePath(useDownloadedFile, configeFileName) {
  return useDownloadedFile
    ? `${extensionPath}/${configeFileName}`
    : `${extensionPath}/build/templates/${configeFileName}`;
}

function copyPlistFileToXcodeProjects(useDownloadedFile) {
  const CONFIG_FILE = 'GoogleService-Info.plist';
  const configFilePath = resolveConfigFilePath(useDownloadedFile, CONFIG_FILE);

  const xcodeProjects = glob.sync(
    `${projectPath}/ios/*.xcodeproj/project.pbxproj`,
  );

  if (xcodeProjects && xcodeProjects.length > 1) {
    console.warn(
      `WARNING! More than one XCode project found. The ${configFilePath} file will be added to each project`,
    );
  } else if (_.isEmpty(xcodeProjects)) {
    console.error(
      'Are you sure you are in a React Native project directory? Xcode project file could not be found.',
    );
    process.exit(1);
  }

  xcodeProjects.forEach(xcodeprojPath => {
    const xcodeProject = xcode.project(xcodeprojPath).parseSync();
    const projectUuid = xcodeProject.getFirstTarget().uuid;

    xcodeProject.addResourceFile(configFilePath, { target: projectUuid });
    fs.writeFileSync(xcodeprojPath, xcodeProject.writeSync());

    console.log(`iOS: Added ${configFilePath} to ${xcodeprojPath} resources`);
  });
}

function copyGoogleServicesConfigToAndroidApp(useDownloadedFile) {
  const CONFIG_FILE = 'google-services.json';
  const configFilePath = resolveConfigFilePath(useDownloadedFile, CONFIG_FILE);
  const configFileDestination = `${projectPath}/android/app/${CONFIG_FILE}`;

  fs.copySync(configFilePath, configFileDestination);
}

function updateGoogleServicesPackageName(buildConfiguration) {
  const { production, release } = buildConfiguration;

  // only update android package on non-production builds
  if (production || release) {
    return;
  }

  const relativePath = 'android/app/google-services.json';
  const filePath = path.join(projectPath, relativePath);
  const fileExists = fs.existsSync(filePath);

  if (!fileExists) {
    console.log(`${relativePath} does not exist, moving on...`);
    return;
  }

  const pkgName = 'com.shoutemapp';
  // eslint-disable-next-line prettier/prettier
  const message = `Updating ${relativePath} package_name to ${pkgName}`.bold
    .green;

  console.time(message);

  // don't throw on invalid json, rather check if the output is `null`
  const data = fs.readJsonSync(filePath, { throws: false });

  if (data === null) {
    console.log(
      `${relativePath} is invalid or empty - please check your shoutem.firebase configuration!`,
    );
    return;
  }

  data.client[0].client_info.android_client_info.package_name = pkgName;

  fs.writeJsonSync(filePath, data);

  console.timeEnd(message);
}

async function preBuild(appConfiguration, buildConfiguration) {
  const { production, release } = buildConfiguration;
  const firebaseExtension = _.get(appConfiguration, 'included').find(
    isFirebaseExtension,
  );
  const legacyApi = _.get(
    firebaseExtension,
    'attributes.settings.services.core.cms',
  );

  if (!legacyApi) {
    throw new Error(
      'Core service endpoints unavailable, could not get API endpoint for preBuild.',
    );
  }

  const resolvedFiles = await downloadConfigurationFiles(
    legacyApi,
    buildConfiguration.appId,
  );

  const isProduction = production || release;
  const shouldUseDownloadedFileAndroid = isProduction && resolvedFiles[0];
  const shouldUseDownloadedFileIos = isProduction && resolvedFiles[1];

  copyGoogleServicesConfigToAndroidApp(shouldUseDownloadedFileAndroid);
  updateGoogleServicesPackageName(buildConfiguration);

  copyPlistFileToXcodeProjects(shouldUseDownloadedFileIos, buildConfiguration);

  injectFirebase();
  injectReactNativePush();
  injectFirebaseSettingsFile();
}

function runPreBuild() {
  const appConfiguration = getAppConfiguration();
  const buildConfiguration = getBuildConfiguration();
  preBuild(appConfiguration, buildConfiguration);
}

module.exports = {
  preBuild,
  runPreBuild,
};
