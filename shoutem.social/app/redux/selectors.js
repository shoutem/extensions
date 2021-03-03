import { getCollection, getOne } from '@shoutem/redux-io';
import _ from 'lodash';
import { ext } from '../const';

export function getUsers(state) {
  const userState = state[ext()].users;

  return getCollection(userState, state);
}

export function getSearchUsers(state) {
  const searchState = state[ext()].searchUsers;

  return getCollection(searchState, state);
}

export function getStatus(state, statusId) {
  const statuses = state[ext()].statuses.data;

  return _.find(statuses, { id: statusId });
}

export function getUserSettings(state) {
  return getOne(state[ext()].userSettings, state);
}

export function getUsersInGroups(state) {
  const usersInGroups = state[ext()].usersInGroups;

  return getCollection(usersInGroups, state);
}
