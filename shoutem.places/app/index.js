import FavoritesList from './screens/FavoritesList';
import FavoritesListWithIcons from './screens/FavoritesListWithIcons';
import MediumPlaceDetails from './screens/MediumPlaceDetails';
import PlaceDetails from './screens/PlaceDetails';
import { PlacesListScreen } from './screens/PlacesList';
import PlacesListWithIcons from './screens/PlacesListWithIcons';
import SinglePlaceMap from './screens/SinglePlaceMap';
import * as actions from './actions';
import reducer from './reducers';

export const screens = {
  PlaceDetails,
  PlacesListScreen,
  PlacesListWithIcons,
  SinglePlaceMap,
  MediumPlaceDetails,
  FavoritesList,
  FavoritesListWithIcons,
};

export { reducer };
export { actions };
