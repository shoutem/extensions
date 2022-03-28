import ArticleDetailsScreen from './screens/ArticleDetailsScreen';
import ArticlesScreen from './screens/ArticlesScreen';
import Grid122ArticlesScreen from './screens/Grid122ArticlesScreen';
import GridArticlesScreen from './screens/GridArticlesScreen';
import LargeArticleDetailsScreen from './screens/LargeArticleDetailsScreen';
import MediumDetailsNoDateScreen from './screens/MediumDetailsNoDateScreen';
import enTranslations from './translations/en.json';
import * as extension from './extension.js';
import reducer from './reducer';

export { FeaturedArticleView } from './components/FeaturedArticleView';
export { GridArticleView } from './components/GridArticleView';
export { ListArticleView } from './components/ListArticleView';
export { NextArticle } from './components/NextArticle';

export const screens = {
  ...extension.screens,
  ArticlesScreen: GridArticlesScreen,
  FixedGridArticlesScreen: GridArticlesScreen,
  CompactListArticlesScreen: ArticlesScreen,
  FeaturedCompactListArticlesScreen: ArticlesScreen,
  LargeListArticlesScreen: ArticlesScreen,
  MediumListArticlesScreen: ArticlesScreen,
  FeaturedMediumListArticlesScreen: ArticlesScreen,
  TileListArticlesScreen: ArticlesScreen,
  FeaturedGrid122ArticlesScreen: Grid122ArticlesScreen,
  Grid122ArticlesScreen,
  ArticleDetailsScreen: LargeArticleDetailsScreen,
  SolidNavbarMediumArticleDetailsScreen: ArticleDetailsScreen,
  SolidNavbarMediumArticleDetailsNoDateScreen: MediumDetailsNoDateScreen,
  SolidNavbarLargeArticleDetailsScreen: LargeArticleDetailsScreen,
  ClearNavbarMediumArticleDetailsScreen: ArticleDetailsScreen,
};

export const { themes } = extension;

export const shoutem = {
  i18n: {
    translations: {
      en: enTranslations,
    },
  },
};

export { reducer };
