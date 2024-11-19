import './navigation';
import * as actions from './redux/actions';
import enTranslations from './translations/en.json';
import * as extension from './extension';
import { openWebViewScreen, resetWebViewMiddleware } from './middleware';
import { reducer } from './redux';

export const shoutem = {
  i18n: {
    translations: {
      en: enTranslations,
    },
  },
};

const middleware = [openWebViewScreen, resetWebViewMiddleware];

const { openURL, reloadWebView } = actions;

export const { screens } = extension;

export { actions, middleware, openURL, reducer, reloadWebView };
