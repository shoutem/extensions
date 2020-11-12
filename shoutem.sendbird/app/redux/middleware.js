import _ from 'lodash';
import { Platform } from 'react-native';
import { priorities, setPriority, before } from 'shoutem-core';
import { UPDATE_SUCCESS } from '@shoutem/redux-io';
import {
  LOGIN,
  REGISTER,
  LOGOUT,
  getUser,
  isUserUpdateAction,
} from 'shoutem.auth';
import {
  NAVIGATION_INITIALIZED,
  navigateTo,
  NAVIGATE_BACK,
  getActiveRoute,
  ROOT_NAVIGATION_STACK,
} from 'shoutem.navigation';
import { getAppId, getSubscriptionValidState } from 'shoutem.application';
import { getExtensionSettings } from 'shoutem.application/redux';
import { SendBird } from '../services';
import { ext, CONNECTION_STATUSES, CHAT_CONVERSATION_SCREEN } from '../const';
import {
  onMessageReceivedHandler,
  onChannelChangedHandler,
  onTypingStatusUpdatedHandler,
} from './handlers';
import { setConnectionState, clearNotificationQueue, setActiveChannel } from './actions';
import { getQueuedNotification, getActiveChannelId } from './selectors';

export const initMiddleware = setPriority(store => next => async (action) => {
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
      onMessageReceived: onMessageReceivedHandler(store.dispatch, store.getState),
      onChannelChanged: onChannelChangedHandler(store.dispatch, store.getState),
      onTypingStatusUpdated: onTypingStatusUpdatedHandler(store.dispatch),
    };

    const metadata = { appId: getAppId().toString() };

    await SendBird.init({ appId: resolvedAppId, user, channelHandlers, metadata })
      .then(() => {
        store.dispatch(setConnectionState(CONNECTION_STATUSES.CONNECTED));
        SendBird.registerPushToken();
      });
  }

  if (action.type === UPDATE_SUCCESS && isUserUpdateAction(action) && SendBird.getInstance()) {
    const name = _.get(user, 'profile.name') || _.get(user, 'profile.nick');
    const profileImage = _.get(user, 'profile.image');

    SendBird.updateUserInfo(name, profileImage);
  }

  return next(action);
}, priorities.AUTH);

export const logoutMiddleware = setPriority(store => next => async (action) => {
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
}, before(priorities.AUTH));

export const notificationQueueMiddleware = store => next => (action) => {
  if (action.type === NAVIGATION_INITIALIZED) {
    const state = store.getState();
    const notification = getQueuedNotification(state);

    if (notification) {
      const sendBirdData = _.get(notification, 'data.sendbird');
      const parsedSendBirdData = Platform.OS === 'ios' ? sendBirdData : JSON.parse(sendBirdData);

      const channelId = _.get(parsedSendBirdData, 'channel.channel_url');

      if (channelId) {
        store.dispatch(navigateTo({
          screen: ext('ChatWindowScreen'),
          props: { channelId },
        }));
      }

      store.dispatch(clearNotificationQueue());
    }
  }

  return next(action);
};

export const navigateBackMiddleware = store => next => (action) => {
  if (action.type === NAVIGATE_BACK) {
    const state = store.getState();
    const activeChannel = getActiveChannelId(state);
    const activeRoute = getActiveRoute(state);
    const isRootNavigationAction = _.get(action, 'navigationStack.name') === ROOT_NAVIGATION_STACK.name;
    const isAtConversationScreen = _.get(activeRoute, 'screen') === CHAT_CONVERSATION_SCREEN;

    if (!_.isEmpty(activeChannel) && isAtConversationScreen && !isRootNavigationAction) {
      store.dispatch(setActiveChannel(''));
    }
  }

  return next(action);
};
