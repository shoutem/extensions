import _ from 'lodash';
import { combineReducers } from 'redux';
import { preventStateRehydration } from 'shoutem.redux';
import {
  CHANNEL_MESSAGES_LOADED,
  NEW_MESSAGE_ADDED,
  CHANNEL_CREATED,
  CHANNELS_LOADED,
  CHANNEL_UPDATED,
  SET_ACTIVE_CHANNEL,
  CONNECTION_STATUS_CHANGE,
  CHANNELS_SEARCH_LOADED,
  CLEAR_CHANNEL_SEARCH,
  QUEUE_NOTIFICATION,
  CLEAR_NOTIFICATION_QUEUE,
} from './actions';
import { CONNECTION_STATUSES } from '../const';

const messages = (state = {}, action) => {
  if (action.type === CHANNEL_MESSAGES_LOADED && !action.payload.append) {
    return {
      ...state,
      [action.payload.channelId]: action.payload.messages,
    };
  }

  if (action.type === CHANNEL_MESSAGES_LOADED && action.payload.append) {
    const previousMessages = _.get(state, [action.payload.channelId], []);

    return {
      ...state,
      [action.payload.channelId]: [
        ...previousMessages,
        ...action.payload.messages,
      ],
    };
  }

  if (action.type === NEW_MESSAGE_ADDED) {
    const previousMessages = _.get(state, [action.payload.channelId], []);

    return {
      ...state,
      [action.payload.channelId]: [
        action.payload.message,
        ...previousMessages,
      ],
    };
  }

  return state;
};

const channels = (state = [], action) => {
  if (action.type === CHANNEL_CREATED) {
    const newChannelId = _.get(action.payload, 'url');
    const existingChannel = _.find(state, channel => channel.channel.url === newChannelId);

    if (existingChannel) {
      return state;
    }

    return [
      { channel: action.payload, changedAt: new Date() },
      ...state,
    ];
  }

  if (action.type === CHANNELS_LOADED && !action.payload.append) {
    return _.map(action.payload, item => ({ channel: item, changedAt: new Date() }));
  }

  if (action.type === CHANNELS_LOADED && action.payload.append) {
    return [
      ...state,
      _.map(action.payload, item => ({ channel: item, changedAt: new Date() })),
    ];
  }

  if (action.type === CHANNEL_UPDATED) {
    const updatedChannelUrl = _.get(action.payload, 'url');
    const updatedChannel = _.find(state, item => item.channel.url === updatedChannelUrl);

    if (!updatedChannel) {
      return [{ channel: action.payload, changedAt: new Date() }, ...state];
    }

    return [
      { channel: action.payload, changedAt: new Date() },
      ..._.without(state, updatedChannel),
    ];
  }

  return state;
};

const activeChannel = (state = '', action) => {
  if (action.type === SET_ACTIVE_CHANNEL) {
    return action.payload;
  }

  return state;
};

const connectionStatus = (state = CONNECTION_STATUSES.DISCONNECTED, action) => {
  if (action.type === CONNECTION_STATUS_CHANGE) {
    return action.payload;
  }

  return state;
};

const channelsSearch = (state = [], action) => {
  if (action.type === CHANNELS_SEARCH_LOADED) {
    return _.map(action.payload, item => ({ channel: item }));
  }

  if (action.type === CLEAR_CHANNEL_SEARCH) {
    return [];
  }

  return state;
};

const notifications = (state = null, action) => {
  if (action.type === QUEUE_NOTIFICATION) {
    return action.payload;
  }

  if (action.type === CLEAR_NOTIFICATION_QUEUE) {
    return null;
  }

  return state;
};

const reducer = combineReducers({
  messages,
  channels,
  activeChannel,
  connectionStatus,
  channelsSearch,
  notifications,
});

export default preventStateRehydration(reducer);
