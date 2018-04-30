/* eslint-disable quotes,max-len */
const fs = require('fs');
const request = require('request');
const _ = require('lodash');
const URI = require('urijs');

const SHOUTEM_APPLICATION = 'shoutem.application';
const API_ENDPOINT = 'legacyApiEndpoint';

function resolveFcmFiles(uri, appId){
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

function endpointForResource(uri, appId, res) {
  return `${uri}${appId}/firebase/objects/FirebaseProject/${res}`;
}

const download = (url, path, callback) => {
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
};

const downloadConfigurationFile = ({ endpoint, filename }) => {
  return new Promise(function(resolve, reject) {
    download(endpoint, filename, (errorMessage) => {
      if (errorMessage) {
        return reject(errorMessage);
      }

      console.log(`Downloaded ${filename} from ${endpoint}`);
      resolve();
    });
  });
};

const isApplicationExtension = i => i.type === 'shoutem.core.extensions' && i.id === SHOUTEM_APPLICATION;

exports.preBuild = function preBuild(appConfiguration, buildConfiguration) {
  const appId = buildConfiguration.appId;

  const appExtension = _.get(appConfiguration, 'included').find(isApplicationExtension);
  const legacyApi = _.get(appExtension, `attributes.settings.${API_ENDPOINT}`);

  if (!legacyApi) {
    throw new Error(`${API_ENDPOINT} not set in ${SHOUTEM_APPLICATION} settings`);
  }

  const uri = new URI(legacyApi).protocol('http').toString();

  const fcmFiles = resolveFcmFiles(uri, appId);
  return Promise.all(fcmFiles.map(downloadConfigurationFile));
};
