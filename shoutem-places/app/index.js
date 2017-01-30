import PlaceDetails from './screens/PlaceDetails';
import PlacesListPhoto from './screens/PlacesListPhoto';
import PlacesListIcon from './screens/PlacesListIcon';
import PlaceDetailsMedium from './screens/PlaceDetailsMedium';
import MapList from './screens/MapList';
import reducer from './reducers';

import * as actions from './action';
export const screens = {
  PlaceDetails,
  PlacesListPhoto,
  PlacesListIcon,
  MapList,
  PlaceDetailsMedium
};

export { reducer };
export { actions };
