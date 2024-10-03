import ArticleDetailsScreen from './screens/ArticleDetailsScreen';
import ArticleMediumDetailsScreen from './screens/ArticleMediumDetailsScreen';
import ArticlesGridScreen from './screens/ArticlesGridScreen';
import ArticlesListScreen from './screens/ArticlesListScreen';
import enTranslations from './translations/en.json';
import reducer from './redux';

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
