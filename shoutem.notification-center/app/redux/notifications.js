import _ from 'lodash';
import { RSAA } from 'redux-api-middleware';
import {
  find,
  invalidate,
  resource,
  LOAD_SUCCESS,
} from '@shoutem/redux-io';
import {
  STATUS,
  busyStatus,
  setStatus,
  updateStatus,
  validationStatus,
} from '@shoutem/redux-io/status';
import { isAppendMode } from '@shoutem/redux-io/actions/find';
import { canHandleAction } from '@shoutem/redux-io/reducers/resource';
import getEndpointProvider from '../EndpointProvider';
import { ext } from '../const';

const MARK_AS_READ_REQUEST = 'shoutem.notification-center.MARK_AS_READ_REQUEST';
const MARK_AS_READ_SUCCESS = 'shoutem.notification-center.MARK_AS_READ_SUCCESS';
const MARK_AS_READ_ERROR = 'shoutem.notification-center.MARK_AS_READ_ERROR';

export const NOTIFICATIONS_SCHEMA = `${ext()}.notifications`;

const DEFAULT_STATE = { data: [] };

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

export function fetchNotifications (params) {
  return find(NOTIFICATIONS_SCHEMA, '', params);
}

export function invalidateNotifications () {
  return invalidate(NOTIFICATIONS_SCHEMA);
}

const getNextActionParams = (action) => ({
  ..._.get(action, 'meta.params'),
});

const getNextActionLinks = (action) => ({
  next: _.get(action, 'payload.paging.next'),
});

const hasNextPage = (payload) => !!_.get(payload, 'paging.next');

const resolveNotification = (notification) => {
  const { imageUrl, audience: { type, groups } } = notification;
  const isSingleGroupNotification = type === 'group' && groups.length === 1;

  if (isSingleGroupNotification) {
    notification.imageUrl = _.get(groups, ['0', 'imageUrl'], imageUrl);
  }

  return notification;
}

const processNotifications = (state, action) => {
  const { payload } = action;

  const notifications = payload.data.map(resolveNotification);
  const newState = isAppendMode(action) ?
    { ...state, data: [...state.data, ...notifications] } :
    { ...state, data: [...notifications] };
  const params = hasNextPage(payload) ? getNextActionParams(action) : {};
  const links = hasNextPage(payload) ? getNextActionLinks(action) : { next: null };

  setStatus(newState, updateStatus(
    state[STATUS],
    {
      validationStatus: validationStatus.VALID,
      busyStatus: busyStatus.IDLE,
      error: false,
      links,
      params,
      schema: NOTIFICATIONS_SCHEMA,
    }
  ));

  return newState;
};

const markNotificationAsRead = (state, action) => {
  const { data } = state;
  const { meta: { id } } = action;

  const notificationIndex = _.findIndex(data, { id });

  const updatedData = data.map((notification, index) => {
    if (index === notificationIndex) {
      return { ...notification, read: true };
    }

    return notification;
  });

  return { ...state, data: updatedData };
};

const notificationsReducer = () => {
  const defaultResourceReducer = resource(NOTIFICATIONS_SCHEMA, DEFAULT_STATE);

  return (state = DEFAULT_STATE, action) => {
    const { type } = action;

    switch (type) {
      case LOAD_SUCCESS:
        if (canHandleAction(action, NOTIFICATIONS_SCHEMA)) {
          return processNotifications(state, action);
        }
        return state;
      case MARK_AS_READ_SUCCESS:
        return markNotificationAsRead(state, action);
      default:
        return defaultResourceReducer(state, action);
    }
  };
};

export default notificationsReducer;
