import ArticlesGridScreen from './screens/ArticlesGridScreen';
import ArticleDetailsScreen from './screens/ArticleDetailsScreen';
import ArticleMediumDetailsScreen from './screens/ArticleMediumDetailsScreen';
import ArticlesListScreen from './screens/ArticlesListScreen';
import ArticlesFeaturedListScreen from './screens/ArticlesFeaturedListScreen';
import reducer from './reducer';

export { FeaturedArticleView } from './components/FeaturedArticleView';
export { GridArticleView } from './components/GridArticleView';
export { ListArticleView } from './components/ListArticleView';
export { NextArticle } from './components/NextArticle';

const screens = {
  ArticlesListScreen,
  ArticlesGridScreen,
  ArticleDetailsScreen,
  ArticleMediumDetailsScreen,
  ArticlesFeaturedListScreen,
};

export {
  reducer,
  screens,
};
