import { SubscriptionsScreen } from './screens';
import enTranslations from './translations/en.json';
import './navigation';

export { appDidMount } from './app';
export { reducer, actions, selectors } from './redux';

export const screens = { SubscriptionsScreen };

export const shoutem = {
  i18n: {
    translations: {
      en: enTranslations,
    },
  },
};
