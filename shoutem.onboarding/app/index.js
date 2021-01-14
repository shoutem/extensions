import { screens } from './extension.js';
import { onboardingMiddleware } from './redux/middleware';
import enTranslations from './translations/en.json';

export { screens };

export const shoutem = {
  i18n: {
    translations: { en: enTranslations },
  },
};

export const middleware = [
  onboardingMiddleware
];

export { default as reducer } from './redux';
