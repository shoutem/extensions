import * as actions from './redux/actions';
import FavoritesList from './screens/FavoritesList';
import FavoritesListWithIcons from './screens/FavoritesListWithIcons';
import MediumPlaceDetails from './screens/MediumPlaceDetails';
import PlaceDetails from './screens/PlaceDetails';
import { PlacesGridScreen } from './screens/PlacesGridScreen';
import { PlacesListScreen } from './screens/PlacesList';
import PlacesListWithIcons from './screens/PlacesListWithIcons';
import SinglePlaceMap from './screens/SinglePlaceMap';
import reducer from './redux';

export { PLACE_DETAILS_SCREEN, PLACES_SCHEMA } from './const';

export const screens = {
  PlaceDetails,
  SolidNavbarPlaceDetails: PlaceDetails,
  PlacesListScreen,
  PlacesListWithIcons,
  PlacesGridScreen,
  SinglePlaceMap,
  MediumPlaceDetails,
  SolidNavbarMediumPlaceDetails: MediumPlaceDetails,
  FavoritesList,
  FavoritesListWithIcons,
};

export { reducer };
export { actions };
