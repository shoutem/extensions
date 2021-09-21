import pack from './package.json';
import {
  MessageListScreen,
  ChatWindowScreen,
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
