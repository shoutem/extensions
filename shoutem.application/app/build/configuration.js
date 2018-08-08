'use strict';

const _ = require('lodash');
const URI = require('urijs');

const SHOUTEM_APPLICATION_EXTENSION = 'shoutem.application';

const getExtension = (appConfiguration, extensionName) => {
  const includedResources = _.get(appConfiguration, 'included');
  const extension = _.find(includedResources, {
    type: 'shoutem.core.extensions',
    id: extensionName,
  });

  return extension;
};

const getExtensionSettings = (appConfiguration, extensionName) => {
  const extension = getExtension(appConfiguration, extensionName);
  return _.get(extension, 'attributes.settings');
};

const getApiEndpoint = (appConfiguration, apiEndpointName) => {
  const appExtensionSettings = getExtensionSettings(
    appConfiguration, SHOUTEM_APPLICATION_EXTENSION
  );
  const baseUrl = appExtensionSettings[apiEndpointName];

  if (!baseUrl) {
    process.exitCode = 1;
    throw new Error(`${apiEndpointName} not set in ${SHOUTEM_APPLICATION_EXTENSION} settings`);
  }

  return new URI(baseUrl);
};

const buildLegacyApiEndpoint = (appConfiguration, urlPath, urlParams) => {
  const apiEndpoint = getApiEndpoint(appConfiguration, 'legacyApiEndpoint');
  return apiEndpoint
    .segment(urlPath)
    .search(urlParams)
    .toString();
};

const buildAppsApiEndpoint = (appConfiguration, buildConfiguration, urlPath, urlParams) => {
  const apiEndpoint = getApiEndpoint(appConfiguration, 'apiEndpoint');
  return apiEndpoint
    .segment(['v1', 'apps', buildConfiguration.appId, urlPath])
    .search(urlParams)
    .toString();
};

exports.getExtension = getExtension;
exports.getExtensionSettings = getExtensionSettings;
exports.getApiEndpoint = getApiEndpoint;
exports.buildLegacyApiEndpoint = buildLegacyApiEndpoint;
exports.buildAppsApiEndpoint = buildAppsApiEndpoint;
