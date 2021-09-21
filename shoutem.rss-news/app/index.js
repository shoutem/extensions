import ArticleDetailsScreen from './screens/ArticleDetailsScreen';
import ArticlesGridScreen from './screens/ArticlesGridScreen';
import ArticlesListScreen from './screens/ArticlesListScreen';
import ArticleMediumDetailsScreen from './screens/ArticleMediumDetailsScreen';
import enTranslations from './translations/en.json';
import { reducer } from './redux';

import './navigation';

const screens = {
  ArticlesListScreen,
  ArticlesFeaturedListScreen: ArticlesListScreen,
  ArticlesGridScreen,
  ArticlesFeaturedGridScreen: ArticlesGridScreen,
  ArticleDetailsScreen,
  ArticleMediumDetailsScreen,
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
