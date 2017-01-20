import PlacesDetailsLarge from './screens/PlacesDetailsLarge';
import PlacesListPhoto from './screens/PlacesListPhoto';
import PlacesListIcon from './screens/PlacesListIcon';
import PlacesDetailsMedium from './screens/PlacesDetailsMedium';
import MapList from './screens/MapList';
import reducer from './reducers';

import * as actions from './action';
export const screens = {
  PlacesDetailsLarge,
  PlacesListPhoto,
  PlacesListIcon,
  MapList,
  PlacesDetailsMedium
};

export { reducer };
export { actions };
