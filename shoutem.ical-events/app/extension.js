// This file is managed by Shoutem CLI
// It exports screens and themes from extension.json
// You should not change it manually
import pack from './package.json';

// screens imports
import EventsFeaturedGridScreen from './screens/EventsFeaturedGridScreen';
import EventsScreen from './screens/EventsScreen';
import EventsFeaturedListScreen from './screens/EventsFeaturedListScreen';
import EventsListScreen from './screens/EventsListScreen';
import EventDetailsScreen from './screens/EventDetailsScreen';
import EventDetailsScreenWithTransparentNavbar from './screens/EventDetailsScreenWithTransparentNavbar';

export const screens = {
  EventsFeaturedGridScreen,
  EventsScreen,
  EventsFeaturedListScreen,
  EventsListScreen,
  EventDetailsScreen,
  EventDetailsScreenWithTransparentNavbar
};

export const themes = {

};

export function ext(resourceName) {
  return resourceName ? `${pack.name}.${resourceName}` : pack.name;
}
