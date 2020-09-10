import EpisodesGridScreen from './screens/EpisodesGridScreen';
import EpisodesListScreen from './screens/EpisodesListScreen';
import EpisodeDetailsScreen from './screens/EpisodeDetailsScreen';
import enTranslations from './translations/en.json';
import { reducer } from './redux';

const screens = {
  EpisodesListScreen,
  EpisodesGridScreen,
  EpisodeDetailsScreen,
  EpisodesFeaturedListScreen: EpisodesListScreen,
  EpisodesFeaturedGridScreen: EpisodesGridScreen,
};

const shoutem = {
  i18n: {
    translations: {
      en: enTranslations,
    },
  },
};

export { appDidMount } from './app';

export { reducer, screens, shoutem };
