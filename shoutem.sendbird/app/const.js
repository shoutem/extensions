import pack from './package.json';

export function ext(resourceName) {
  return resourceName ? `${pack.name}.${resourceName}` : pack.name;
}

export const CONNECTION_STATUSES = {
  ONLINE: 'online',
  OFFLINE: 'offline',
  CONNECTED: 'connected',
  CONNECTING: 'connecting',
  DISCONNECTED: 'disconnected',
};

export const CHAT_CONVERSATION_SCREEN = ext('ChatWindowScreen');
