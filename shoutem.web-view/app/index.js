import WebViewScreen from './screens/WebViewScreen';
import * as actions from './redux';

import {
  openWebViewScreen,
 } from './middleware';

import enTranslations from './translations/en.json';

const screens = {
  WebViewScreen,
};

export const shoutem = {
  i18n: {
    translations: {
      en: enTranslations,
    },
  },
};

const middleware = [
  openWebViewScreen,
];

const { openURL } = actions;

export {
  screens,
  middleware,
  actions,
  openURL,
};
