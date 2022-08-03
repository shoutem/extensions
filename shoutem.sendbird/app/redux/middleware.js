import _ from 'lodash';
import { UPDATE_SUCCESS } from '@shoutem/redux-io';
import { getAppId, getSubscriptionValidState } from 'shoutem.application';
import { getExtensionSettings } from 'shoutem.application/redux';
import {
  getUser,
  isUserUpdateAction,
  LOGIN,
  LOGOUT,
  REGISTER,
} from 'shoutem.auth';
import { before, priorities, setPriority } from 'shoutem-core';
import { CONNECTION_STATUSES, ext } from '../const';
import { SendBird } from '../services';
import { setConnectionState } from './actions';
import {
  onChannelChangedHandler,
  onMessageReceivedHandler,
  onTypingStatusUpdatedHandler,
} from './handlers';

export const initMiddleware = setPriority(
  store => next => async action => {
    const actionType = _.get(action, 'type');
    const state = store.getState();
    const user = getUser(state);
    const hasValidSubscription = getSubscriptionValidState(state);

    if (actionType === LOGIN || actionType === REGISTER) {
      const extensionSettings = getExtensionSettings(state, ext());
      const { appId, shoutemAppId, featureActive } = extensionSettings;
      const resolvedAppId = _.isEmpty(appId) ? shoutemAppId : appId;

      if (!featureActive || !hasValidSubscription) {
        return;
      }

      const channelHandlers = {
        onMessageReceived: onMessageReceivedHandler(
          store.dispatch,
          store.getState,
        ),
        onChannelChanged: onChannelChangedHandler(
          store.dispatch,
          store.getState,
        ),
        onTypingStatusUpdated: onTypingStatusUpdatedHandler(store.dispatch),
      };

      const metadata = { appId: getAppId().toString() };

      await SendBird.init({
        appId: resolvedAppId,
        user,
        channelHandlers,
        metadata,
      }).then(() => {
        store.dispatch(setConnectionState(CONNECTION_STATUSES.CONNECTED));
        SendBird.registerPushToken();
      });
    }

    if (
      action.type === UPDATE_SUCCESS &&
      isUserUpdateAction(action) &&
      SendBird.getInstance()
    ) {
      const name = _.get(user, 'profile.name') || _.get(user, 'profile.nick');
      const profileImage = _.get(user, 'profile.image');

      SendBird.updateUserInfo(name, profileImage);
    }

    return next(action);
  },
  priorities.AUTH,
);

export const logoutMiddleware = setPriority(
  store => next => async action => {
    if (action.type === LOGOUT && SendBird.getInstance()) {
      try {
        await SendBird.setPushTriggerOption('off');
        SendBird.disconnect();
        store.dispatch(setConnectionState(CONNECTION_STATUSES.DISCONNECTED));
      } catch {
        store.dispatch(setConnectionState(CONNECTION_STATUSES.DISCONNECTED));
        return next(action);
      }
    }

    return next(action);
  },
  before(priorities.AUTH),
);
