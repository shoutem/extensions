import reducer from './redux';
import Favorite from './components/Favorite';
import enTranslations from './translations/en.json';

export const shoutem = {
  i18n: {
    translations: {
      en: enTranslations,
    },
  },
};

export { appDidMount } from './app';
export {
  getFavoriteItems,
  isFavoritesSchema,
  isFavoriteItem,
  getFavoriteCollection,
  fetchFavoritesData,
} from './helpers';
export { Favorite };
export { saveFavorite, deleteFavorite } from './redux';
export { reducer };
export { FavoritesListScreen } from './screens/FavoritesListScreen';
