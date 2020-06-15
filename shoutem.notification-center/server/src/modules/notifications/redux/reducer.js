import { storage, collection, resource } from '@shoutem/redux-io';
import { combineReducers } from 'redux';
import ext from 'src/const';
import { NOTIFICATIONS } from '../const';

export const reducer = combineReducers({
  [NOTIFICATIONS]: storage(NOTIFICATIONS),
  notifications: collection(NOTIFICATIONS, ext('notificationsPage')),
  rawNotifications: resource(NOTIFICATIONS),
});
