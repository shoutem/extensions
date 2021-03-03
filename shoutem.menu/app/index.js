// Constants `screens`, `actions` and `reducer` are exported via named export
// It is important to use those exact names

import MenuDetailsScreen from './screens/MenuDetailsScreen';
import MenuListScreen from './screens/MenuListScreen';
import MenuSmallListScreen from './screens/MenuSmallListScreen';
import reducer from './reducers';

export const screens = {
  MenuListScreen,
  MenuSmallListScreen,
  MenuDetailsScreen,
};

export { reducer };
