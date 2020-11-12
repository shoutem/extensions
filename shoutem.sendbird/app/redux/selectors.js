import _ from 'lodash';
import { ext, CONNECTION_STATUSES } from '../const';

function getModuleState(state) {
  return state[ext()];
}

function orderByLastMessage(channels) {
  return _.orderBy(channels, ['channel.lastMessage.createdAt'], ['desc']);
}

export function getChannelMessages(channel, state) {
  const channelId = _.get(channel, 'url');

  return _.get(getModuleState(state).messages, [channelId], []);
}

export function getChannels(state, orderBy = orderByLastMessage) {
  const channels = getModuleState(state).channels;

  return orderBy(channels);
}

export function getSearchedChannels(state) {
  return getModuleState(state).channelsSearch;
}

export function getChannel(channelId, state) {
  return _.find(getChannels(state), channel => channel.channel.url === channelId);
}

export function getConnectionState(state) {
  return getModuleState(state).connectionStatus;
}

export function isConnecting(state) {
  return getConnectionState(state) === CONNECTION_STATUSES.CONNECTING;
}

export function isConnected(state) {
  return getConnectionState(state) === CONNECTION_STATUSES.CONNECTED;
}

export function isDisconnected(state) {
  return getConnectionState(state) === CONNECTION_STATUSES.DISCONNECTED;
}

export function getActiveChannelId(state) {
  return getModuleState(state).activeChannel;
}

export function getActiveChannel(state) {
  const activeChannelId = getActiveChannelId(state);

  return getChannel(activeChannelId, state);
}

export function getQueuedNotification(state) {
  return getModuleState(state).notifications;
}
