import PlaceDetails from './screens/PlaceDetails';
import { PlacesList } from './screens/PlacesList';
import IconPlacesList from './screens/IconPlacesList';
import MediumPlaceDetails from './screens/MediumPlaceDetails';
import SinglePlaceMap from './screens/SinglePlaceMap';
import reducer from './reducers';
import * as actions from './action';

export const screens = {
  PlaceDetails,
  PlacesList,
  IconPlacesList,
  SinglePlaceMap,
  MediumPlaceDetails,
};

export { reducer };
export { actions };
