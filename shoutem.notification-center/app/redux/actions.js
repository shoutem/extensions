import { Platform } from 'react-native';
import _ from 'lodash';
import moment from 'moment';
import { RSAA } from 'redux-api-middleware';
import { find, invalidate } from '@shoutem/redux-io';
import { getExtensionSettings } from 'shoutem.application';
import { checkNotifications, RESULTS } from 'shoutem.permissions';
import { ext } from '../const';
import getEndpointProvider from '../EndpointProvider';
import { notificationJourneys, notifications } from '../services';
import { getActiveJourneys } from './selectors';

export const NOTIFICATIONS_SCHEMA = ext('notifications');

export const GROUPS_SCHEMA = ext('groups');
export const SELECTED_GROUPS_SCHEMA = ext('selectedGroups');

export const MARK_AS_READ_REQUEST = ext('MARK_AS_READ_REQUEST');
export const MARK_AS_READ_SUCCESS = ext('MARK_AS_READ_SUCCESS');
export const MARK_AS_READ_ERROR = ext('MARK_AS_READ_ERROR');
export const SET_NOTIFICATION_SETTINGS = ext('SET_NOTIFICATION_SETTINGS');

export const SAVE_JOURNEY = ext('SAVE_JOURNEY');
export const CANCEL_JOURNEY = ext('CANCEL_JOURNEY');

export function fetchGroups() {
  return find(GROUPS_SCHEMA);
}

export function fetchSelectedGroups() {
  return (dispatch, getState) => {
    const { deviceToken } = getState()[ext()];
    dispatch(find(SELECTED_GROUPS_SCHEMA, '', { deviceToken }));
  };
}

export function markAsRead({ id }) {
  const body = JSON.stringify({ ids: [id] });
  return {
    [RSAA]: {
      endpoint: getEndpointProvider().markAsRead,
      method: 'POST',
      body,
      types: [
        {
          type: MARK_AS_READ_REQUEST,
          meta: {
            id,
          },
        },
        {
          type: MARK_AS_READ_SUCCESS,
          meta: {
            id,
          },
        },
        {
          type: MARK_AS_READ_ERROR,
          meta: {
            id,
          },
        },
      ],
    },
  };
}

export function fetchNotifications(params) {
  return find(NOTIFICATIONS_SCHEMA, '', params);
}

export function invalidateNotifications() {
  return invalidate(NOTIFICATIONS_SCHEMA);
}

export function setNotificationSettings(settings) {
  return dispatch => {
    dispatch({ payload: settings, type: SET_NOTIFICATION_SETTINGS });
  };
}

export function triggerCanceled(triggerId) {
  return async dispatch => {
    await notifications.cancelLocalNotifications(triggerId);

    return dispatch({
      type: CANCEL_JOURNEY,
      payload: {
        triggerId,
      },
    });
  };
}

export function updateActiveJourney(triggerId, journey, payload = null) {
  return async dispatch => {
    await notifications.cancelLocalNotifications(triggerId);

    if (!journey.active || !notificationJourneys.isJourneyActive(journey)) {
      return dispatch({
        type: SAVE_JOURNEY,
        payload: {
          [journey.id]: {
            ...journey,
            active: false,
          },
        },
      });
    }

    notificationJourneys.scheduleNotifications(
      triggerId,
      journey.notifications,
      payload,
    );

    return dispatch({
      type: SAVE_JOURNEY,
      payload: {
        [journey.id]: {
          ...journey,
          active: true,
          startedAt: Date.now(),
          estimatedEndsAt: notificationJourneys.calculateEndsAt(journey),
        },
      },
    });
  };
}

// Checks if journey is scheduled, and if no notifications have been
// triggered yet. If both conditions are met, the journey is cancelled
export function cancelPendingJourney(triggerId) {
  return (dispatch, getState) => {
    const state = getState();

    const activeJourneys = getActiveJourneys(state);
    const matchingActiveJourney = _.find(
      activeJourneys,
      journey => journey.trigger.value === triggerId,
    );

    if (!matchingActiveJourney) {
      return;
    }

    const firstNotification = _.head(_.sortBy(matchingActiveJourney.notifications, ['delay']));
    const firstNotificationDate = moment(matchingActiveJourney.startedAt).add(firstNotification.delay, 'minutes');

    if (moment(Date.now()).isAfter(firstNotificationDate)) {
      return;
    }

    dispatch(triggerCanceled(triggerId));
  }
}

export function triggerOccured(triggerId, payload = null) {
  return async (dispatch, getState) => {
    const state = getState();
    const isAndroid = Platform.OS === 'android';

    const activeJourneys = getActiveJourneys(state);

    const matchingActiveJourney = _.find(
      activeJourneys,
      journey => journey.id === triggerId,
    );

    const notificationPermissionStatus = await checkNotifications();
    const hasGrantedPermission =
      notificationPermissionStatus.status === RESULTS.GRANTED;
    const hasNotificationsPermission = isAndroid ? true : hasGrantedPermission;

    if (matchingActiveJourney || !hasNotificationsPermission) {
      // If journey has already started or push notifications are
      // not allowed, we do nothing. Wait for the current journey to finish
      // before starting campaign again
      return null;
    }

    const extensionSettings = getExtensionSettings(state, ext());
    const journey = _.find(
      extensionSettings.journeys,
      journey => journey.active && journey.id === triggerId,
    );

    if (!_.isEmpty(journey)) {
      notificationJourneys.scheduleNotifications(
        triggerId,
        journey.notifications,
        payload,
      );

      return dispatch({
        type: SAVE_JOURNEY,
        payload: {
          [journey.id]: {
            ...journey,
            startedAt: Date.now(),
            estimatedEndsAt: notificationJourneys.calculateEndsAt(journey),
          },
        },
      });
    }

    return null;
  };
}
