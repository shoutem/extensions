import _ from 'lodash';
import { getExtensionSettings } from 'shoutem.application';
import { ext } from '../const';

function getModuleState(state) {
  return state[ext()];
}

export function getSelectedLocale(state) {
  return _.get(getModuleState(state), ['selectedLocale']);
}

export function getActiveLocales(state) {
  const settings = getExtensionSettings(state, ext());
  const locales = _.get(settings, 'disabled');

  return _.reduce(locales, (activeLocales, isDisabled, key) => {
    if (!isDisabled) {
      return [...activeLocales, key];
    }

    return activeLocales;
  }, []);
}

export function getActiveChannelId(state) {
  const locale = getSelectedLocale(state);
  const settings = getExtensionSettings(state, ext());
  const channels = _.get(settings, 'channels');
  const isMultilanguage = _.get(settings, 'isMultilanguage');

  // Temporary workaround for https://fiveminutes.jira.com/browse/SEEXT-8703
  if (!isMultilanguage) {
    return null;
  }

  if (channels) {
    return channels[locale];
  }

  return null;
}

export default {
  getModuleState,
  getSelectedLocale,
  getActiveLocales,
  getActiveChannelId,
};
