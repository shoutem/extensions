import { ext } from '../const';

export function getQueuedNotification(state) {
  return state[ext()].notificationQueue;
}
