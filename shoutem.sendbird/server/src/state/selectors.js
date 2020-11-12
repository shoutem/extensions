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

export function isChatModuleActive(state) {
  const chatModule = _.find(
    getInstalledModules(state),
    module => module.name === ext(),
  );

  if (chatModule) {
    return true;
  }

  return false;
}
