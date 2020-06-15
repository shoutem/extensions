import { getCollection } from '@shoutem/redux-io';
import ext from 'src/const';
import { moduleName } from '../const';

function getNotificationsState(state) {
  return state[ext()][moduleName];
}

export function getNotifications(state) {
  const { notifications } = getNotificationsState(state);
  return getCollection(notifications, state);
}

export function getRawNotifications(state) {
  return getNotificationsState(state).rawNotifications;
}
