import _ from 'lodash';

function getSetting(valueKey, nextSettings = {}, settings = {}) {
  const previousValue = _.get(settings, valueKey, false);
  return _.get(nextSettings, valueKey, previousValue);
}

export function canManuallyApproveMembers(nextAppSettings, appSettings) {
  return getSetting('manuallyApproveMembers', nextAppSettings, appSettings);
}

export function areAllScreensProtected(nextSettings, settings) {
  return getSetting('allScreensProtected', nextSettings, settings);
}

export function isSignupEnabled(nextSettings, settings) {
  return getSetting('signupEnabled', nextSettings, settings);
}
