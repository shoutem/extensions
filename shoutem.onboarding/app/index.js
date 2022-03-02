import './navigation';
import enTranslations from './translations/en.json';
import { screens } from './extension.js';
import {
  completeOnboardingMiddleware,
  getOnboardingCompleted,
  ONBOARDING_FINISHED,
  showOnboardingMiddleware,
} from './redux';

export { getOnboardingCompleted, ONBOARDING_FINISHED, screens };

export const shoutem = {
  i18n: {
    translations: { en: enTranslations },
  },
};

export const middleware = [
  showOnboardingMiddleware,
  completeOnboardingMiddleware,
];

export { default as reducer } from './redux';
