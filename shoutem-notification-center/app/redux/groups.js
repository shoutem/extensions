import _ from 'lodash';

import {
  DEVICE_TOKEN_RECEIVED,
  SELECT_PUSH_NOTIFICATION_GROUPS,
} from 'shoutem.push-notifications';

import {
  find,
  LOAD_SUCCESS,
  resource,
} from '@shoutem/redux-io';

import { canHandleAction } from '@shoutem/redux-io/reducers/resource';
import { chainReducers } from '@shoutem/redux-composers';

import { ext, GROUP_PREFIX } from '../const';

export const GROUPS_SCHEMA = `${ext()}.groups`;
export const SELECTED_GROUPS_SCHEMA = `${ext()}.selectedGroups`;

export function fetchGroups() {
  return find(GROUPS_SCHEMA);
}

export function fetchSelectedGroups() {
  return (dispatch, getState) => {
    const deviceToken = getState()[ext()].deviceToken;
    dispatch(find(SELECTED_GROUPS_SCHEMA, '', { deviceToken }));
  };
}

/**
 * @see SELECT_PUSH_NOTIFICATION_GROUPS
 * Used for triggering push notification group subscription
 * @param added - notification groups which need to be added to subscribed groups
 * @param removed - notification groups which need to be removed from subscribed groups
 * @returns {{type: String, payload: {added: [], removed: []}}}
 */
export function selectPushNotificationGroups({ added, removed }) {
  return {
    type: SELECT_PUSH_NOTIFICATION_GROUPS,
    payload: {
      added,
      removed,
    },
  };
}

export const deviceToken = (state = '', action) => {
  switch (action.type) {
    case DEVICE_TOKEN_RECEIVED:
      return action.token || null;
    default:
      return state;
  }
};

export const groups = resource(GROUPS_SCHEMA);

export const manuallyUnsubscribedGroups = (state = [], action) => {
  switch (action.type) {
    case SELECT_PUSH_NOTIFICATION_GROUPS:
      return _.difference(_.union(state, action.payload.removed), action.payload.added);
    default:
      return state;
  }
};

const selectedGroupsReducer = (state = [], action) => {
  switch (action.type) {
    case SELECT_PUSH_NOTIFICATION_GROUPS:
      return _.difference(_.union(state, action.payload.added), action.payload.removed);
    default:
      return state;
  }
};

export const selectedGroups = chainReducers([
  resource(SELECTED_GROUPS_SCHEMA),
  selectedGroupsReducer,
]);

/**
 * Returns true if a group should be subscribed to by default but isn't,
 * and the user didn't manually unsubscribe.
 */
const shouldSubscribeToGroupByDefault = (group, selectedGroups, manuallyUnsubscribedGroups) => {
  const { subscribeByDefault, tag } = group;
  const prefixedTag = `${GROUP_PREFIX + tag}`;

  if (!subscribeByDefault) {
    return false;
  }

  const isSubscribed = _.includes(selectedGroups, prefixedTag);
  const isManuallyUnsubscribed = _.includes(manuallyUnsubscribedGroups, prefixedTag);

  return !isSubscribed && !isManuallyUnsubscribed;
};

/**
 * Some groups have a 'subscribe by default' setting. This middleware
 * subscribes the user to these groups if he didn't manually unsubscribe
 * whenever new selected groups are received from the server.
 */
const selectGroupsSubscribedToByDefault = store => next => (action) => {
  if (!(canHandleAction(action, SELECTED_GROUPS_SCHEMA) && action.type === LOAD_SUCCESS)) {
    return next(action);
  }
  const state = store.getState()[ext()];

  const { groups: { data: groups }, manuallyUnsubscribedGroups } = state;
  const selectedGroups = action.payload;

  const groupsToSubscribeTo = _.filter(groups, group =>
    shouldSubscribeToGroupByDefault(group, selectedGroups, manuallyUnsubscribedGroups));

  if (_.size(groupsToSubscribeTo)) {
    const tagsToSubscribeTo = _.map(groupsToSubscribeTo, group => `${GROUP_PREFIX + group.tag}`);

    store.dispatch(selectPushNotificationGroups({ added: tagsToSubscribeTo,
      removed: [] }));

    return next({ ...action, payload: selectedGroups.concat(tagsToSubscribeTo) });
  }

  return next(action);
};

/**
 * Loads selected groups after all groups are loaded.
 */
const loadSelectedGroups = store => next => (action) => {
  if (canHandleAction(action, GROUPS_SCHEMA) && action.type === LOAD_SUCCESS) {
    store.dispatch(fetchSelectedGroups());
  }
  return next(action);
};

export const middleware = [loadSelectedGroups, selectGroupsSubscribedToByDefault];
