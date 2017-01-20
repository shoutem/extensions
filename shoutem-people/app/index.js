// Constants `screens`, `actions` and `reducer` are exported via named export
// It is important to use those exact names

import reducer from './reducers';
import PeopleListScreen from './screens/PeopleListScreen.js';
import PeopleDetailsScreen from './screens/PeopleDetailsScreen.js';

export const screens = {
  PeopleListScreen,
  PeopleDetailsScreen,
};

export { reducer };

