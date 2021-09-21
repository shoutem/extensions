import _ from 'lodash';
import { CONNECTION_STATUSES, CHAT_CONVERSATION_SCREEN } from '../const';
import { getCurrentRoute } from 'shoutem.navigation';
import { SendBird } from '../services';
import { setNewMessage, updateChannel, setConnectionState } from './actions';
import { getActiveChannelId } from './selectors';

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
  return channel => {
    dispatch(updateChannel(channel));
  };
}

function onChannelChangedHandler(dispatch, getState) {
  return channel => {
    const state = getState();
    const activeChannelId = getActiveChannelId(state);
    const currentRoute = getCurrentRoute();
    const isAtConversationScreen =
      currentRoute.name === CHAT_CONVERSATION_SCREEN;

    dispatch(updateChannel(channel));

    if (isAtConversationScreen && channel.url === activeChannelId) {
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
