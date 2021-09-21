import FavoritesList from './screens/FavoritesList';
import FavoritesListWithIcons from './screens/FavoritesListWithIcons';
import MediumPlaceDetails from './screens/MediumPlaceDetails';
import PlaceDetails from './screens/PlaceDetails';
import { PlacesListScreen } from './screens/PlacesList';
import PlacesListWithIcons from './screens/PlacesListWithIcons';
import { PlacesGridScreen } from './screens/PlacesGridScreen';
import SinglePlaceMap from './screens/SinglePlaceMap';
import * as actions from './redux/actions';
import reducer from './redux';

export { PLACES_SCHEMA, PLACE_DETAILS_SCREEN } from './const';

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
