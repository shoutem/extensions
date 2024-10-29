import ext from 'src/const';
import { getCollection } from '@shoutem/redux-io';
import { moduleName } from '../const';

function getUserGroupsState(state) {
  return state[ext()][moduleName];
}

export function getUserGroups(state) {
  const { userGroups } = getUserGroupsState(state);
  return getCollection(userGroups, state);
}

export function getAllUserGroups(state) {
  const { allUserGroups } = getUserGroupsState(state);
  return getCollection(allUserGroups, state);
}
