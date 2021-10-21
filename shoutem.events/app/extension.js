// This file is managed by Shoutem CLI
// You should not change it
import pack from './package.json';

// screens imports
import EventsScreen from './screens/EventsScreen';
import GridEventsScreen from './screens/GridEventsScreen';
import LargeEventDetailsScreen from './screens/LargeEventDetailsScreen';
import MediumEventDetailsScreen from './screens/MediumEventDetailsScreen';
import SingleEventMapScreen from './screens/SingleEventMapScreen';

export const screens = {
  EventsScreen,
  GridEventsScreen,
  LargeEventDetailsScreen,
  MediumEventDetailsScreen,
  SingleEventMapScreen,
};

export const themes = {};

export function ext(resourceName) {
  return resourceName ? `${pack.name}.${resourceName}` : pack.name;
}
