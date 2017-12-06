// This file is managed by Shoutem CLI
// You should not change it
import pack from './package.json';

// screens imports
import SocialWallScreen from './screens/SocialWallScreen';
import StatusDetailsScreen from './screens/StatusDetailsScreen';
import CreateStatusScreen from './screens/CreateStatusScreen';
import MembersScreen from './screens/MembersScreen';
import SearchScreen from './screens/SearchScreen';

export const screens = {
  SocialWallScreen,
  StatusDetailsScreen,
  CreateStatusScreen,
  MembersScreen,
  SearchScreen,
};

export const themes = {

};

export function ext(resourceName) {
  return resourceName ? `${pack.name}.${resourceName}` : pack.name;
}
