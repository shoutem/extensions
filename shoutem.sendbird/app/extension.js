import pack from './package.json';
import {
  ChatWindowScreen,
  MessageListScreen,
  PhotoFullScreen,
} from './screens';

export const screens = {
  MessageListScreen,
  ChatWindowScreen,
  PhotoFullScreen,
};

export function ext(resourceName) {
  return resourceName ? `${pack.name}.${resourceName}` : pack.name;
}
