import _ from 'lodash';
import { isInitialized } from '@shoutem/redux-io';

export function isLanguageModuleEnabled(languageModuleStatus) {
  if (!isInitialized(languageModuleStatus)) {
    return false;
  }

  return _.get(languageModuleStatus, 'enabled');
}

export function resolveHasLanguages(languageModuleStatus, languages) {
  const enabled = isLanguageModuleEnabled(languageModuleStatus);
  if (!enabled) {
    return false;
  }

  return isInitialized(languages) && !_.isEmpty(languages);
}
