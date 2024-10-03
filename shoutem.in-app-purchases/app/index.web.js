import './navigation';
import enTranslations from './translations/en.json';
import { SubscriptionsScreen } from './screens';

// Removing appDidMount because web doesn't initialize IAP Hub.
export { actions, reducer, selectors } from './redux';

export const screens = { SubscriptionsScreen };

export const shoutem = {
  i18n: {
    translations: {
      en: enTranslations,
    },
  },
};
