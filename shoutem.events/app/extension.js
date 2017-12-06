// This file is managed by Shoutem CLI
// You should not change it
import pack from './package.json';

// screens imports
import GridEventsScreen from './screens/GridEventsScreen';
import EventsScreen from './screens/EventsScreen';
import MediumEventDetailsScreen from './screens/MediumEventDetailsScreen';
import LargeEventDetailsScreen from './screens/LargeEventDetailsScreen';
import SingleEventMapScreen from './screens/SingleEventMapScreen';

export const screens = {
  GridEventsScreen,
  EventsScreen,
  MediumEventDetailsScreen,
  LargeEventDetailsScreen,
  SingleEventMapScreen,
};

export const themes = {

};

export function ext(resourceName) {
  return resourceName ? `${pack.name}.${resourceName}` : pack.name;
}
