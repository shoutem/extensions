import { ext } from '../const';

export function getLatestVideos(state) {
  return state[ext()].latestVideos;
}
