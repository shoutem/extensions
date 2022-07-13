import './navigation';
import * as actions from './redux/actions';
import enTranslations from './translations/en.json';
import * as extension from './extension';
import { openWebViewScreen } from './middleware';

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
