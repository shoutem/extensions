import { screens } from './extension.js';
import enTranslations from './translations/en.json';
import { showOnboardingMiddleware } from './redux';

import './navigation';

export { screens };

export const shoutem = {
  i18n: {
    translations: { en: enTranslations },
  },
};

export const middleware = [showOnboardingMiddleware];

export { default as reducer } from './redux';

export { appWillMount } from './app';
