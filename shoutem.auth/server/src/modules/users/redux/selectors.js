import ext from 'src/const';
import { getCollection } from '@shoutem/redux-io';
import { moduleName } from '../const';

function getUsersState(state) {
  return state[ext()][moduleName];
}

export function getUsers(state) {
  const users = getUsersState(state).currentUsersPage;
  return getCollection(users, state);
}
