/* eslint-disable quotes,max-len,no-console */
const _ = require('lodash');
const fs = require('fs-extra');
const path = require('path');
const request = require('request');
const URI = require('urijs');
const glob = require('glob');
const xcode = require('xcode');
const { projectPath } = require('@shoutem/build-tools');
const { injectFirebase } = require('../build/injectFirebase');

const extensionPath = `${projectPath}/node_modules/shoutem.firebase`;
const SHOUTEM_APPLICATION = 'shoutem.application';
const API_ENDPOINT = 'legacyApiEndpoint';

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

  request.get(url, (err, res, data) => {
    if (_.isEmpty(data)) {
      process.exitCode = 1;
      throw new Error(`Received empty response from\n${url}\n>>> Please check your shoutem.firebase settings! <<<`);
    }
  })
    .on('error', (err) => {
      fs.unlink(path);

      if (callback) {
        callback(err.message);
      }
    })
    .pipe(file)
    .on('finish', () => {
      file.close(callback);
    });
}

function downloadConfigurationFile({ endpoint, filename }) {
  return new Promise(function (resolve, reject) {
    download(endpoint, filename, (errorMessage) => {
      if (errorMessage) {
        throw new Error(errorMessage);
      }

      console.log(`Downloaded ${filename} from ${endpoint}`);
      resolve();
    });
  });
}

function downloadConfigurationFiles(legacyApi, appId) {
  const uri = new URI(legacyApi).protocol('http').toString();
  const fcmFiles = resolveFcmFiles(uri, appId);

  return Promise.all(fcmFiles.map(downloadConfigurationFile));
}

function isApplicationExtension(data) {
  return data.type === 'shoutem.core.extensions' && data.id === SHOUTEM_APPLICATION;
}

function copyPlistFileToXcodeProjects() {
  const CONFIG_FILE = 'GoogleService-Info.plist';
  const configFilePath = `${extensionPath}/${CONFIG_FILE}`;

  const xcodeProjects = glob.sync(`${projectPath}/ios/*.xcodeproj/project.pbxproj`);

  if (xcodeProjects && xcodeProjects.length > 1) {
    console.warn(`WARNING! More than one XCode project found. The ${configFilePath} file will be added to each project`);
  } else if (_.isEmpty(xcodeProjects)) {
    console.error('Are you sure you are in a React Native project directory? Xcode project file could not be found.');
    process.exit(1);
  }

  xcodeProjects.forEach((xcodeprojPath) => {
    const xcodeProject = xcode.project(xcodeprojPath).parseSync();
    const projectUuid = xcodeProject.getFirstTarget().uuid;

    xcodeProject.addResourceFile(configFilePath, { target: projectUuid });
    fs.writeFileSync(xcodeprojPath, xcodeProject.writeSync());

    console.log(`iOS: Added ${configFilePath} to ${xcodeprojPath} resources`);
  });
}

function copyGoogleServicesConfigToAndroidApp() {
  const CONFIG_FILE = 'google-services.json';
  const configFilePath = `${extensionPath}/${CONFIG_FILE}`;
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
  const message = `Updating ${relativePath} package_name to ${pkgName}`.bold.green;

  console.time(message);

  // don't throw on invalid json, rather check if the output is `null`
  const data = fs.readJsonSync(filePath, { throws: false });

  if (data === null) {
    console.log(`${relativePath} is invalid or empty - please check your shoutem.firebase configuration!`);
    resolve();
    return;
  }

  data.client[0].client_info.android_client_info.package_name = pkgName;

  fs.writeJsonSync(filePath, data);

  console.timeEnd(message);
}

exports.preBuild = function preBuild(appConfiguration, buildConfiguration) {
  const appExtension = _.get(appConfiguration, 'included').find(isApplicationExtension);
  const legacyApi = _.get(appExtension, `attributes.settings.${API_ENDPOINT}`);

  if (!legacyApi) {
    throw new Error(`${API_ENDPOINT} not set in ${SHOUTEM_APPLICATION} settings`);
  }

  return downloadConfigurationFiles(legacyApi, buildConfiguration.appId)
    .then(() => {
      copyPlistFileToXcodeProjects();
      copyGoogleServicesConfigToAndroidApp();
      updateGoogleServicesPackageName(buildConfiguration);
      injectFirebase();
    });
};
