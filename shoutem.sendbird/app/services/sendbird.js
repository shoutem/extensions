import { Platform } from 'react-native';
import _ from 'lodash';
import moment from 'moment';
import SendBird from 'sendbird';

const requiredConfigKeys = ['appId', 'user'];

let SendBirdInstance = null;
let pushToken = null;

const SENDBIRD_NOT_INITIALIZED_ERROR = new Error(
  'SendBird not yet initialized',
);

export function formatMessageDate(timestamp) {
  const time = moment(timestamp);

  if (moment().diff(time, 'days') >= 1) {
    return time.format('M/D/YYYY');
  }

  return time.format('h:mm A');
}

function validateSendBirdConfig(config) {
  return _.every(
    requiredConfigKeys,
    key => _.includes(_.keys(config), key) && !_.isEmpty(config[key]),
  );
}

function disconnect() {
  if (SendBirdInstance) {
    SendBirdInstance.disconnect();
  }
}

function connect(userId) {
  return new Promise((resolve, reject) => {
    if (!SendBirdInstance) {
      reject(SENDBIRD_NOT_INITIALIZED_ERROR);
    }

    SendBirdInstance.connect(userId, (user, error) => {
      if (error) {
        reject(error);
      }

      resolve(user);
    });
  });
}

function setForegroundState() {
  if (SendBirdInstance) {
    SendBirdInstance.setForegroundState();
  }
}

function setBackgroundState() {
  if (SendBirdInstance) {
    SendBirdInstance.setBackgroundState();
  }
}

function createGroupChat(userIds, config) {
  return new Promise((resolve, reject) => {
    if (!SendBirdInstance) {
      reject(SENDBIRD_NOT_INITIALIZED_ERROR);
    }

    const params = new SendBirdInstance.GroupChannelParams();
    _.forEach(config, (value, key) => {
      params[key] = value;
    });
    params.addUserIds(userIds);

    SendBirdInstance.GroupChannel.createChannel(params, (channel, error) => {
      if (error) {
        reject(error);
      }

      resolve(channel);
    });
  });
}

function createDirectChat(userId, targetUserId) {
  const params = {
    isPublic: false,
    isDistinct: true,
  };

  return createGroupChat([userId, targetUserId], params);
}

function getUserChatList(groupChannelListQuery) {
  return new Promise((resolve, reject) => {
    if (!SendBirdInstance) {
      reject(SENDBIRD_NOT_INITIALIZED_ERROR);
    }

    if (groupChannelListQuery.hasNext) {
      groupChannelListQuery.next((channelList, error) => {
        if (error) {
          reject(error);
        }

        resolve(channelList);
      });
    }
  });
}

function searchConversationsPerNickname(nickname, limit = 100) {
  return new Promise((resolve, reject) => {
    if (!SendBirdInstance) {
      reject(SENDBIRD_NOT_INITIALIZED_ERROR);
    }

    this.searchChannelsListQuerry = SendBirdInstance.GroupChannel.createMyGroupChannelListQuery();
    this.searchChannelsListQuerry.order = 'latest_last_message';
    this.searchChannelsListQuerry.limit = limit;
    this.searchChannelsListQuerry.nicknameContainsFilter = nickname;

    if (this.searchChannelsListQuerry.hasNext) {
      this.searchChannelsListQuerry.next((channelList, error) => {
        if (error) {
          reject(error);
        }

        resolve(channelList);
      });
    }
  });
}

function getChannelMessages(messageQuery) {
  return new Promise((resolve, reject) => {
    messageQuery.load((messages, error) => {
      if (error) {
        reject(error);
      }

      resolve(messages);
    });
  });
}

function markMessagesRead(channelUrl) {
  return new Promise((resolve, reject) => {
    SendBirdInstance.GroupChannel.getChannel(channelUrl, (channel, error) => {
      if (error) {
        reject(error);
      }

      channel.markAsRead();
      resolve();
    });
  });
}

function createUserMetadata(metadata) {
  return new Promise((resolve, reject) => {
    if (_.isEmpty(metadata) || !SendBirdInstance) {
      reject(
        new Error(
          'Calling update on non-configured SendBird instance or with empty metadata',
        ),
      );
    }

    const user = SendBirdInstance.currentUser;
    const currentMeta = _.get(user, 'metaData');

    if (!_.isEmpty(currentMeta)) {
      resolve(
        console.log('Metadata already exists. Skipping metadata creation'),
      );
    }

    user.createMetaData(metadata, (computedData, error) => {
      if (error) {
        reject(error);
      }

      resolve(computedData);
    });
  });
}

function updateUserMetadata(metadata) {
  return new Promise((resolve, reject) => {
    if (_.isEmpty(metadata) || !SendBirdInstance) {
      reject(
        new Error(
          'Calling update on non-configured SendBird instance or with empty metadata',
        ),
      );
    }

    const user = SendBirdInstance.currentUser;
    const currentMeta = _.get(user, 'metaData');

    if (_.isEqual(metadata, currentMeta)) {
      return;
    }

    user.updateMetaData(metadata, (computedData, error) => {
      if (error) {
        reject(error);
      }

      resolve(computedData);
    });
  });
}

function updateUserInfo(nickname, profileUrl) {
  return new Promise((resolve, reject) => {
    if (!SendBirdInstance) {
      reject(SENDBIRD_NOT_INITIALIZED_ERROR);
    }

    const resolvedProfileUrl = _.isEmpty(profileUrl)
      ? SendBirdInstance.currentUser.profileUrl
      : profileUrl;

    SendBirdInstance.updateCurrentUserInfo(
      nickname,
      resolvedProfileUrl,
      (response, error) => {
        if (error) {
          reject(error);
        }

        resolve(response);
      },
    );
  });
}

function sendMessage(textMessage, channel) {
  return new Promise((resolve, reject) => {
    const params = new SendBirdInstance.UserMessageParams();

    params.message = textMessage;

    channel.sendUserMessage(params, (message, error) => {
      if (error) {
        reject(error);
      }

      resolve(message);
    });
  });
}

function sendFileMessage(source, channel, uploadProgressHandler) {
  return new Promise((resolve, reject) => {
    if (_.isEmpty(source)) {
      reject(new Error('Invalid file message source'));
    }

    const file = {
      uri: source.uri,
      name: source.fileName || 'image.jpeg',
      type: source.type,
      size: source.fileSize,
    };

    channel.sendFileMessage(file, uploadProgressHandler, (message, error) => {
      if (error) {
        reject(error);
      }

      resolve(message);
    });
  });
}

export function composeSendBirdId(user) {
  const { id, realm } = user;
  const realmId = _.get(realm, 'id') || _.get(realm, 'data.id');

  if (id && realmId) {
    return `${realmId}-${id}`;
  }

  return null;
}

function registerChannelHandlers(channelHandlers) {
  if (!channelHandlers || _.isEmpty(channelHandlers)) {
    return;
  }

  const ChannelHandler = new SendBirdInstance.ChannelHandler();

  _.forEach(channelHandlers, (handler, handlerName) => {
    ChannelHandler[handlerName] = handler;
  });

  SendBirdInstance.addChannelHandler('CHANNEL_HANDLER', ChannelHandler);
}

function registerConnectionHandlers(connectionHandlers) {
  if (!connectionHandlers || _.isEmpty(connectionHandlers)) {
    return;
  }

  const ConnectionHandler = new SendBirdInstance.ConnectionHandler();

  _.forEach(connectionHandlers, (handler, handlerName) => {
    ConnectionHandler[handlerName] = handler;
  });

  SendBirdInstance.addConnectionHandler(
    'CONNECTION_HANDLER',
    ConnectionHandler,
  );
}

/**
 * @param {Object} config
 * @param {string} config.appId - Shoutem app ID
 * @param {Object} [config.channelHandlers] - Object with named SB handler functions
 * -> https://docs.sendbird.com/javascript/event_handler
 * @param {Object} config.user - Shoutem user.
 */
function init(config) {
  const configValid = validateSendBirdConfig(config);

  // We expect more config params long term, which is why the validation process
  if (!configValid) {
    return new Error('SendBird config invalid');
  }

  const { appId, user } = config;

  SendBirdInstance = new SendBird({ appId });
  const userId = composeSendBirdId(user);
  const name = _.get(user, 'profile.name') || _.get(user, 'profile.nick');
  const profileImage = _.get(user, 'profile.image');
  const channelHandlers = _.get(config, 'channelHandlers', []);
  const connectionHandlers = _.get(config, 'connectionHandlers', []);
  const metadata = _.get(config, 'metadata', {});

  return connect(userId).then(() => {
    updateUserInfo(name, profileImage);
    createUserMetadata(metadata);
    registerChannelHandlers(channelHandlers);
    registerConnectionHandlers(connectionHandlers);
  });
}

function getInstance() {
  return SendBirdInstance;
}

function setPushTriggerOption(trigger = 'all') {
  return new Promise((resolve, reject) => {
    if (!SendBirdInstance) {
      reject(SENDBIRD_NOT_INITIALIZED_ERROR);
    }

    SendBirdInstance.setPushTriggerOption(trigger, (response, error) => {
      if (error) {
        reject(error);
      }

      resolve(response);
    });
  });
}

// This can happen before the SendBird User is connected, in
// which case the registration won't work properly. That's why we retry this
// when the SendBird is configured
function registerPushToken(token = pushToken) {
  if (!token) {
    return null;
  }

  pushToken = token;

  if (!SendBirdInstance) {
    return new Error(SENDBIRD_NOT_INITIALIZED_ERROR);
  }

  if (Platform.OS === 'ios') {
    return SendBirdInstance.registerAPNSPushTokenForCurrentUser(
      token,
      response => {
        if (response === 'success') {
          setPushTriggerOption();
          pushToken = null;
        }
      },
    );
  }

  return SendBirdInstance.registerGCMPushTokenForCurrentUser(
    token,
    response => {
      if (response === 'success') {
        setPushTriggerOption();
        pushToken = null;
      }
    },
  );
}

function getChannelPerId(channelId) {
  if (!SendBirdInstance) {
    return new Error(SENDBIRD_NOT_INITIALIZED_ERROR);
  }

  if (!channelId) {
    return null;
  }

  return new Promise((resolve, reject) => {
    SendBirdInstance.GroupChannel.getChannel(channelId, (channel, error) => {
      if (error) {
        reject(error);
      }

      resolve(channel);
    });
  });
}

function getChannelPartner(channel, currentUser) {
  if (!channel) {
    return null;
  }

  const { members } = channel;
  const currentUserId = composeSendBirdId(currentUser);

  if (!currentUserId) {
    return null;
  }

  return _.find(members, groupMember => groupMember.userId !== currentUserId);
}

export default {
  getChannelPartner,
  getInstance,
  init,
  disconnect,
  connect,
  sendMessage,
  sendFileMessage,
  createDirectChat,
  updateUserInfo,
  createGroupChat,
  getUserChatList,
  updateUserMetadata,
  createUserMetadata,
  searchConversationsPerNickname,
  getChannelMessages,
  markMessagesRead,
  formatMessageDate,
  registerPushToken,
  setForegroundState,
  setPushTriggerOption,
  setBackgroundState,
  getChannelPerId,
};
