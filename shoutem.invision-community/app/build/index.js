const { getBuildConfiguration } = require('@shoutem/build-tools');
const injectUniversalLinkSupport = require('./injectUniversalLinkSupport');
const injectDeeplinkSchema = require('./injectDeeplinkSchema');

function preBuild(_appConfiguration, buildConfiguration) {
  const appId = buildConfiguration.appId;

  injectDeeplinkSchema(appId);
  injectUniversalLinkSupport();
}

function runPreBuild() {
  const buildConfiguration = getBuildConfiguration();

  preBuild(null, buildConfiguration);
}

module.exports = {
  preBuild,
  runPreBuild,
};
