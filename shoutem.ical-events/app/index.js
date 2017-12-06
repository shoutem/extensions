// Reference for app/index.js can be found here:
// http://shoutem.github.io/docs/extensions/reference/extension-exports

import * as extension from './extension.js';
import rio, { storage, collection } from '@shoutem/redux-io';
import reducer, { EVENTS_PROXY_SCHEMA } from './redux';
import enTranslations from './translations/en.json';

export const screens = extension.screens;
export const themes = extension.themes;

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
