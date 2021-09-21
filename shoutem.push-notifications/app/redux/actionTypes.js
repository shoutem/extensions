import { ext } from '../const';

/**
 * @namespace PushNotificationActionTypes
 * Redux action types dispatched by Shoutem push notifications and its implementations.
 *

/**
 @typedef SELECT_PUSH_NOTIFICATION_GROUPS
 @type {object}
 @property payload {added: [], removed: []} Data
 */
export const SELECT_PUSH_NOTIFICATION_GROUPS = ext('SELECT_GROUPS');

/**
 @typedef DEVICE_TOKEN_RECEIVED
 @type {object}
 @property type String
 @property token String
 */
export const DEVICE_TOKEN_RECEIVED = ext('DEVICE_TOKEN_RECEIVED');
