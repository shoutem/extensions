import { ext } from '../const';

export function getUsers(state) {
  return state[ext()].users;
}
