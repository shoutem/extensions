import ArtworkRadioScreen from './screens/ArtworkRadioScreen';
import Radio from './screens/Radio';
import enTranslations from './translations/en.json';

export const screens = {
  Radio,
  ArtworkRadioScreen,
};

export const shoutem = {
  i18n: {
    translations: {
      en: enTranslations,
    },
  },
};

export { reducer } from './redux';
