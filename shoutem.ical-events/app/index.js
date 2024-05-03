// Reference for app/index.js can be found here:
// http://shoutem.github.io/docs/extensions/reference/extension-exports

import rio from '@shoutem/redux-io';
import { getExtensionServiceUrl } from 'shoutem.application';
import EventDetailsScreen from './screens/EventDetailsScreen';
import EventMapScreen from './screens/EventMapScreen';
import EventsGridScreen from './screens/EventsGridScreen';
import EventsListScreen from './screens/EventsListScreen';
import enTranslations from './translations/en.json';
import { ext } from './const';
import reducer, { EVENTS_PROXY_SCHEMA, parseICalMiddleware } from './redux';

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

export function appDidMount(app) {
  const store = app.getStore();
  const state = store.getState();

  const proxyEndpoint = getExtensionServiceUrl(state, ext(), 'proxy');

  rio.registerResource({
    schema: EVENTS_PROXY_SCHEMA,
    request: {
      endpoint: `${proxyEndpoint}/v1/proxy/ical/events/{?query*}`,
      headers: {
        Accept: 'application/vnd.api+json',
      },
    },
  });
}

export { reducer };

export const middleware = [parseICalMiddleware];
