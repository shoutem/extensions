import './navigation';
import enTranslations from './translations/en.json';
import * as extension from './extension';
import { openWebViewScreen } from './middleware';
import * as actions from './redux';

export const shoutem = {
  i18n: {
    translations: {
      en: enTranslations,
    },
  },
};

const middleware = [openWebViewScreen];

const { openURL } = actions;

export const { screens } = extension;

export { actions, middleware, openURL };
