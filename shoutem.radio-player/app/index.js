import './navigation';
import ArtworkRadioScreen from './screens/ArtworkRadioScreen';
import Radio from './screens/Radio';
import RadioRssScreen from './screens/RadioRssScreen';
import enTranslations from './translations/en.json';

export const screens = {
  Radio,
  ArtworkRadioScreen,
  RadioRssScreen,
};

export const shoutem = {
  i18n: {
    translations: {
      en: enTranslations,
    },
  },
};

export { reducer } from './redux';
