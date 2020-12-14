import { getCollection } from '@shoutem/redux-io';
import _ from 'lodash';
import { ext } from '../const';

function getModuleState(state) {
  return state[ext()];
}

export function getInstalledModules(state) {
  const collection = getModuleState(state).appModules;

  return getCollection(collection, state);
}

export function getChatModule(state) {
  const modules = getInstalledModules(state);

  return _.find(modules, module => module.name === ext());
}

export function isChatModuleActive(state) {
  const chatModule = getChatModule(state);

  if (chatModule) {
    return true;
  }

  return false;
}
