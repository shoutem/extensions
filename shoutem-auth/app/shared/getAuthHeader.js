import { ext } from '../const.js';

export function getAuthHeader(state) {
  const accessToken = state[ext()].accessToken;
  return `Bearer ${accessToken}`;
}
