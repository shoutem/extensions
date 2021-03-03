import BooksListScreen from './screens/BooksListScreen';
import BooksSmallListScreen from './screens/BooksSmallListScreen';
import MyBooksScreen from './screens/MyBooksScreen';
import BooksDetailsScreen from './screens/BooksDetailsScreen';
import enTranslations from './translations/en.json';
import reducer from './redux';

export const screens = {
  BooksListScreen,
  BooksSmallListScreen,
  MyBooksScreen,
  BooksDetailsScreen,
};

export const shoutem = {
  i18n: {
    translations: {
      en: enTranslations,
    },
  },
};

export { reducer };
