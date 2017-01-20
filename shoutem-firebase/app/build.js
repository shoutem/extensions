/* eslint-disable quotes,max-len */
const fs = require('fs');
const http = require('http');
const _ = require('lodash');
const SHOUTEM_APPLICATION = 'shoutem.application';
const API_ENDPOINT = 'legacyApiEndpoint';

const download = (url, path, callback) => {
  const file = fs.createWriteStream(path);
  http.get(url, response => {
    response.pipe(file);
    file.on('finish', () => {
      file.close(callback);
    });
  }).on('error', err => {
    fs.unlink(path);
    if (callback) {
      callback(err.message);
    }
  });
};

const downloadConfigurationFile = ({ endpoint, filename }) => {
  download(endpoint, filename, (errorMessage) => {
    const successMessage = `Downloaded ${filename} from ${endpoint}`;
    console.log(errorMessage || successMessage);
  });
};

const isApplicationExtension = (i) => i.type === 'shoutem.core.extensions' && i.id === SHOUTEM_APPLICATION;

exports.preBuild = function preBuild(appConfiguration, buildConfiguration) {
  const appId = buildConfiguration.appId;
  const appExtension = _.get(appConfiguration, 'included').find(isApplicationExtension);
  const legacyApi = _.get(appExtension, `attributes.settings.${API_ENDPOINT}`);

  if (!legacyApi) {
    process.exitCode = 1;
    throw new Error(`${API_ENDPOINT} not set in ${SHOUTEM_APPLICATION} settings`);
  }

  const endpointForResource = (res) => `${legacyApi}/${appId}/firebase/objects/FirebaseProject/${res}`;

  [
    {
      filename: 'google-services.json',
      endpoint: endpointForResource('googleservices.json'),
    },
    {
      filename: 'GoogleService-Info.plist',
      endpoint: endpointForResource('googleservices.plist'),
    },
  ].forEach(downloadConfigurationFile);
};
