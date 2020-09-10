import { ext } from '../const';

function getModuleState(state) {
  return state[ext()];
}

export const getLastNotification = (state) =>
  getModuleState(state).lastNotification;

export function getQueuedNotification(state) {
  return getModuleState(state).pendingNotification;
}
