import _ from 'lodash';
import { SendBird, composeSendBirdId } from '../services';

export const NEW_MESSAGE_ADDED = 'shoutem.sendbird.NEW_MESSAGE_ADDED';
export const CHANNEL_MESSAGES_LOADED = 'shoutem.sendbird.CHANNEL_MESSAGES_LOADED';
export const CHANNEL_CREATED = 'shoutem.sendbird.CHANNEL_CREATED';
export const CHANNELS_LOADED = 'shoutem.sendbird.CHANNELS_LOADED';
export const CHANNELS_SEARCH_LOADED = 'shoutem.sendbird.CHANNELS_SEARCH_LOADED';
export const CLEAR_CHANNEL_SEARCH = 'shoutem.sendbird.CLEAR_CHANNEL_SEARCH';
export const CHANNEL_UPDATED = 'shoutem.sendbird.CHANNEL_UPDATED';
export const SET_ACTIVE_CHANNEL = 'shoutem.sendbird.SET_ACTIVE_CHANNEL';
export const CONNECTION_STATUS_CHANGE = 'shoutem.sendbird.CONNECTION_STATUS_CHANGE';
export const QUEUE_NOTIFICATION = 'shoutem.sendbird.QUEUE_NOTIFICATION';
export const CLEAR_NOTIFICATION_QUEUE = 'shoutem.sendbird.CLEAR_NOTIFICATION_QUEUE';

export function setConnectionState(connectionState) {
  return { type: CONNECTION_STATUS_CHANGE, payload: connectionState };
}

export function loadChannelMessages(channel, messageQuery, append = false) {
  return dispatch => SendBird.getChannelMessages(messageQuery).then(messages => dispatch({
    type: CHANNEL_MESSAGES_LOADED,
    payload: { messages, channelId: _.get(channel, 'url'), append },
  }));
}

export function searchChannelsPerNickname(nickname) {
  return dispatch => SendBird.searchConversationsPerNickname(nickname, 3).then(channels => dispatch({
    type: CHANNELS_SEARCH_LOADED,
    payload: channels,
  }));
}

export function clearChannelSearch() {
  return {
    type: CLEAR_CHANNEL_SEARCH,
  };
}

export function setNewMessage(channel, message) {
  const channelId = _.get(channel, 'url');

  return {
    type: NEW_MESSAGE_ADDED,
    payload: { message, channelId },
  };
}

export function sendFileMessage(channel, file, progressHandler) {
  return (dispatch) => {
    const channelId = _.get(channel, 'url');

    return SendBird.sendFileMessage(file, channel, progressHandler).then(newMessage => dispatch({
      type: NEW_MESSAGE_ADDED,
      payload: { message: newMessage, channelId },
    }));
  };
}

export function sendMessage(channel, message) {
  const channelId = _.get(channel, 'url');

  return dispatch => SendBird.sendMessage(message, channel).then(newMessage => dispatch({
    type: NEW_MESSAGE_ADDED,
    payload: { message: newMessage, channelId },
  }));
}

export function loadChannels(groupChannelListQuery, append = false) {
  return dispatch => SendBird.getUserChatList(groupChannelListQuery).then(channels => dispatch({
    type: CHANNELS_LOADED,
    payload: channels,
    append,
  }));
}

export function loadChannel(channelId) {
  return dispatch => SendBird.getChannelPerId(channelId).then(channel => dispatch({
    type: CHANNEL_UPDATED,
    payload: channel,
  }));
}

export function createChannel(userId, targetId) {
  return dispatch => SendBird.createDirectChat(userId, targetId)
    .then((channel) => {
      if (channel && channel.memberCount > 1) {
        return dispatch({
          type: CHANNEL_CREATED,
          payload: channel,
        });
      }

      return null;
    });
}

export function updateChannel(channel) {
  return { type: CHANNEL_UPDATED, payload: channel };
}

export function setActiveChannel(channelId) {
  return { type: SET_ACTIVE_CHANNEL, payload: channelId };
}

export function queueNotification(notification) {
  return { type: QUEUE_NOTIFICATION, payload: notification };
}

export function clearNotificationQueue() {
  return { type: CLEAR_NOTIFICATION_QUEUE };
}
