// Reference for app/index.js can be found here:
// http://shoutem.github.io/docs/extensions/reference/extension-exports

import rio from '@shoutem/redux-io';
import reducer, { EVENTS_PROXY_SCHEMA } from './redux';
import EventsGridScreen from './screens/EventsGridScreen';
import EventsListScreen from './screens/EventsListScreen';
import EventDetailsScreen from './screens/EventDetailsScreen';
import EventMapScreen from './screens/EventMapScreen';
import enTranslations from './translations/en.json';

export const screens = {
  EventsFeaturedGridScreen: EventsGridScreen,
  EventsGridScreen,
  EventsFeaturedListScreen: EventsListScreen,
  EventsListScreen,
  EventDetailsScreen,
  EventDetailsScreenWithTransparentNavbar: EventDetailsScreen,
  EventMapScreen,
};

export const themes = {};

export const shoutem = {
  i18n: {
    translations: {
      en: enTranslations,
    },
  },
};

export function appDidMount() {
  rio.registerResource({
    schema: EVENTS_PROXY_SCHEMA,
    request: {
      endpoint: 'https://proxy.api.shoutem.com/v1/proxy/ical/events/{?query*}',
      headers: {
        Accept: 'application/vnd.api+json',
      },
    },
  });
}

export { reducer };
