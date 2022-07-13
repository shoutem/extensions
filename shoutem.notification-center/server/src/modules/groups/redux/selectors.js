import ext from 'src/const';
import { getCollection } from '@shoutem/redux-io';
import { moduleName } from '../const';

function getGroupsState(state) {
  return state[ext()][moduleName];
}

export function getGroups(state) {
  const { groups } = getGroupsState(state);
  return getCollection(groups, state);
}

export function getRawGroups(state) {
  return getGroupsState(state).rawGroups;
}
