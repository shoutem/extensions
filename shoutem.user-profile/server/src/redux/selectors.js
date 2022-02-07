import { getCollection } from '@shoutem/redux-io';
import { ext } from '../const';

export function getUsersState(state) {
  return state[ext()].users;
}

export function getUserGroupsState(state) {
  return state[ext()].userGroups;
}

export function getCurrentUsersPage(state) {
  return state[ext()].currentUsersPage;
}

export function getUsers(state) {
  const users = getCurrentUsersPage(state);

  return getCollection(users, state);
}

export function getUserGroups(state) {
  const { userGroups } = getUserGroupsState(state);

  return getCollection(userGroups, state);
}

export function getAllUserGroups(state) {
  const { allUserGroups } = getUserGroupsState(state);

  return getCollection(allUserGroups, state);
}
