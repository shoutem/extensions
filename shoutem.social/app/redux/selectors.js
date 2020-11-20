import { getCollection } from '@shoutem/redux-io'
import { ext } from '../const';

export function getUsers(state) {
  const userState = state[ext()].users;

  return getCollection(userState, state);
}
export function getSearchUsers(state) {
  const searchState = state[ext()].searchUsers;

  return getCollection(searchState, state);
}
