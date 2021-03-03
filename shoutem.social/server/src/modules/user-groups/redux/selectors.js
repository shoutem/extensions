import { getCollection } from '@shoutem/redux-io';
import ext from 'src/const';
import { moduleName } from '../const';

function getUserGroupsState(state) {
  return state[ext()][moduleName];
}

export function getAllUserGroups(state) {
  const allUserGroups = getUserGroupsState(state).allUserGroups;
  return getCollection(allUserGroups, state);
}
