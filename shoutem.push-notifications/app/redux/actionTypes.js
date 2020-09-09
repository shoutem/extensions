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
 @typedef NOTIFICATION_RECEIVED
 @type {object}
 @property body {action_type: , action_params: } Data
 */
export const NOTIFICATION_RECEIVED = ext('NOTIFICATION_RECEIVED');

/**
 @typedef USER_NOTIFIED
 @type {object}
 */
export const USER_NOTIFIED = ext('USER_NOTIFIED');

/**
 @typedef DEVICE_TOKEN_RECEIVED
 @type {object}
 @property type String
 @property token String
 */
export const DEVICE_TOKEN_RECEIVED = ext('DEVICE_TOKEN_RECEIVED');

/**
 @typedef SHOW_PUSH_NOTIFICATION
 @type {object}
 @property type String
 @property token String
 */
export const SHOW_PUSH_NOTIFICATION = ext('SHOW_PUSH_NOTIFICATION');

export const SET_PENDING_NOTIFICATION = ext('SET_PENDING_NOTIFICATION');

export const CLEAR_PENDING_NOTIFICATION = ext('CLEAR_PENDING_NOTIFICATION');
