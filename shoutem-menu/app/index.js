// Constants `screens`, `actions` and `reducer` are exported via named export
// It is important to use those exact names

import reducer from './reducers';
import MenuListScreen from './screens/MenuListScreen.js';
import MenuSmallListScreen from './screens/MenuSmallListScreen.js';
import MenuDetailsScreen from './screens/MenuDetailsScreen.js';

export const screens = {
  MenuListScreen,
  MenuSmallListScreen,
  MenuDetailsScreen,
};

export { reducer };

