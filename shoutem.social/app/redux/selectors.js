import _ from 'lodash';
import { cloneStatus, getCollection, getOne } from '@shoutem/redux-io';
import { getUser } from 'shoutem.auth';
import { ext } from '../const';

export function getBlockedUsers(state) {
  return state[ext()].blockedUsers;
}

export function getBlockedUsersIds(state) {
  const blockedUsersState = state[ext()].blockedUsers;
  const { legacyId: currentUserId } = getUser(state);

  return _.get(blockedUsersState, currentUserId, []);
}

export function getBlockedUsersData(state) {
  const blockedUsersState = state[ext()].allBlockedUsers;

  return getCollection(blockedUsersState, state);
}

function filterBlockedUsers(state, collection = [], userIdPath) {
  const blockedUsers = getBlockedUsersIds(state);

  const filteredUsers = _.filter(collection, item => {
    const userId = _.get(item, userIdPath);
    return !_.includes(blockedUsers, _.toString(userId));
  });

  cloneStatus(collection, filteredUsers);

  return filteredUsers;
}

export function getAllUsers(state) {
  const userState = state[ext()].users;

  return getCollection(userState, state);
}

export function getUsers(state) {
  const users = getAllUsers(state);
  const filteredUsers = filterBlockedUsers(state, users, 'legacyId');

  return filteredUsers;
}

export function getSearchUsers(state) {
  const searchState = state[ext()].searchUsers;

  return getCollection(searchState, state);
}

export function getStatuses(state) {
  return state[ext()].statuses;
}

export function getStatusesData(state) {
  const statuses = getStatuses(state);
  return statuses?.data;
}

export function getStatus(state, statusId) {
  const statuses = getStatusesData(state);

  return _.find(statuses, { id: statusId });
}

export function getUserSettings(state) {
  return getOne(state[ext()].userSettings, state);
}

export function getStatusesForUser(state) {
  const statuses = getStatusesData(state);

  return {
    data: filterBlockedUsers(state, statuses, ['user', 'id']),
  };
}

export function getCommentsForStatus(state, statusId) {
  const { comments } = state[ext()];

  return _.get(comments, statusId, {});
}

export function getFilteredCommentsForStatus(state, statusId) {
  const allComments = getCommentsForStatus(state, statusId);

  return { data: filterBlockedUsers(state, allComments.data, ['user', 'id']) };
}

export function getUsersInGroups(state) {
  const usersInGroupsState = state[ext()].usersInGroups;
  const usersInGroups = getCollection(usersInGroupsState, state);

  return filterBlockedUsers(state, usersInGroups, 'legacyId');
}

export function getSavedDraft(state) {
  return state[ext()].statusDraft;
}
