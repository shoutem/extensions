import _ from 'lodash';
import { ext } from 'src/const';
import { getCollection, getOne, isInitialized } from '@shoutem/redux-io';
import { moduleName } from '../const';

function getModuleState(state) {
  return state[ext()][moduleName];
}

export function getLanguageModuleStatus(state) {
  const moduleState = getModuleState(state);
  const rawLanguageModule = _.get(moduleState, 'rawLanguageModule');
  const enabled = _.get(rawLanguageModule, 'data.enabled');

  const languageModule = getOne(moduleState.languageModule, state);
  if (isInitialized(languageModule)) {
    _.set(languageModule, 'enabled', enabled);
  }

  return languageModule;
}

export function getLanguages(state) {
  const moduleState = getModuleState(state);
  const languages = _.get(moduleState, 'languages');
  return getCollection(languages, state);
}

export function getRawLanguages(state) {
  const moduleState = getModuleState(state);
  const languages = getLanguages(state);
  const rawChannelsPayload = _.get(moduleState, 'rawChannels');
  const rawChannels = _.get(rawChannelsPayload, 'data');

  const filteredLanguages = _.filter(rawChannels, rawChannel => {
    const id = _.get(rawChannel, 'id');

    if (_.find(languages, { id })) {
      return rawChannel;
    }
  });

  return filteredLanguages;
}
