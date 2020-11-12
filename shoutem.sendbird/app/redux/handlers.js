import _ from 'lodash';
import { getActiveRoute } from 'shoutem.navigation';
import { setNewMessage, updateChannel, setConnectionState } from './actions';
import { getActiveChannelId } from './selectors';
import { SendBird } from '../services';
import { CONNECTION_STATUSES, CHAT_CONVERSATION_SCREEN } from '../const';

function onMessageReceivedHandler(dispatch, getState) {
  return (channel, message) => {
    const state = getState();
    const activeChannelId = getActiveChannelId(state);

    if (channel.url === activeChannelId) {
      dispatch(setNewMessage(channel, message));
    }
  };
}

function onTypingStatusUpdatedHandler(dispatch) {
  return (channel) => {
    dispatch(updateChannel(channel));
  };
}

function isAtConversationScreen(state) {
  const activeRoute = getActiveRoute(state);
  return _.get(activeRoute, 'screen') === CHAT_CONVERSATION_SCREEN;
}

function onChannelChangedHandler(dispatch, getState) {
  return (channel) => {
    const state = getState();
    const activeChannelId = getActiveChannelId(state);

    dispatch(updateChannel(channel));

    if (isAtConversationScreen(state) && channel.url === activeChannelId) {
      SendBird.markMessagesRead(activeChannelId);
    }
  };
}

function onReconnectStarted(dispatch) {
  return () => dispatch(setConnectionState(CONNECTION_STATUSES.CONNECTING));
}

function onReconnectSucceeded(dispatch) {
  return () => dispatch(setConnectionState(CONNECTION_STATUSES.CONNECTED));
}

function onReconnectFailed(dispatch) {
  return () => dispatch(setConnectionState(CONNECTION_STATUSES.DISCONNECTED));
}

export {
  onMessageReceivedHandler,
  onChannelChangedHandler,
  onTypingStatusUpdatedHandler,
  onReconnectStarted,
  onReconnectSucceeded,
  onReconnectFailed,
};
