// This file is managed by Shoutem CLI
// You should not change it
import PageScreen from './screens/PageScreen';
import pack from './package.json';

export const screens = {
  PageScreen,
};

export const themes = {};

export function ext(resourceName) {
  return resourceName ? `${pack.name}.${resourceName}` : pack.name;
}
