import './navigation';
import EpisodeDetailsScreen from './screens/EpisodeDetailsScreen';
import EpisodesFeaturedImageListScreen from './screens/EpisodesFeaturedImageListScreen';
import EpisodesGridScreen from './screens/EpisodesGridScreen';
import EpisodesLargeGridScreen from './screens/EpisodesLargeGridScreen';
import EpisodesListScreen from './screens/EpisodesListScreen';
import MyPodcastsScreen from './screens/MyPodcastsScreen';
import enTranslations from './translations/en.json';
import { reducer } from './redux';

const screens = {
  EpisodeDetailsScreen,
  EpisodeDetailsWithoutShareScreen: EpisodeDetailsScreen,
  EpisodesFeaturedGridScreen: EpisodesGridScreen,
  EpisodesFeaturedLargeGridScreen: EpisodesLargeGridScreen,
  EpisodesFeaturedListScreen: EpisodesListScreen,
  EpisodesGridScreen,
  EpisodesLargeGridScreen,
  EpisodesListScreen,
  MyPodcastsScreen,
  EpisodesFeaturedImageListScreen,
};

const shoutem = {
  i18n: {
    translations: {
      en: enTranslations,
    },
  },
};

export { appWillMount } from './app';

export { reducer, screens, shoutem };

export { PlaybackService } from './services';
