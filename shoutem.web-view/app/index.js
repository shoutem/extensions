import * as actions from './redux';
import * as extension from './extension';
import { openWebViewScreen } from './middleware';

import enTranslations from './translations/en.json';

import './navigation';

export const shoutem = {
  i18n: {
    translations: {
      en: enTranslations,
    },
  },
};

const middleware = [openWebViewScreen];

const { openURL } = actions;

export const screens = extension.screens;

export { middleware, actions, openURL };
