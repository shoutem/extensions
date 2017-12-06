/* eslint-disable quotes,max-len */
const fs = require('fs');
const request = require('request');
const _ = require('lodash');
const URI = require('urijs');

const SHOUTEM_APPLICATION = 'shoutem.application';
const API_ENDPOINT = 'legacyApiEndpoint';

const download = (url, path, callback) => {
  const file = fs.createWriteStream(path);
  request.get(url)
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
  download(endpoint, filename, (errorMessage) => {
    const successMessage = `Downloaded ${filename} from ${endpoint}`;
    console.log(errorMessage || successMessage);
  });
};

const isApplicationExtension = i => i.type === 'shoutem.core.extensions' && i.id === SHOUTEM_APPLICATION;

exports.preBuild = function preBuild(appConfiguration, buildConfiguration) {
  const appId = buildConfiguration.appId;
  const appExtension = _.get(appConfiguration, 'included').find(isApplicationExtension);
  const legacyApi = _.get(appExtension, `attributes.settings.${API_ENDPOINT}`);

  if (!legacyApi) {
    process.exitCode = 1;
    throw new Error(`${API_ENDPOINT} not set in ${SHOUTEM_APPLICATION} settings`);
  }

  const uri = new URI(legacyApi).protocol('http').toString();
  const endpointForResource = res => `${uri}${appId}/firebase/objects/FirebaseProject/${res}`;

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
