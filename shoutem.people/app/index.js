// Constants `screens`, `actions` and `reducer` are exported via named export
// It is important to use those exact names

import PeopleDetailsScreen from './screens/PeopleDetailsScreen';
import PeopleListScreen from './screens/PeopleListScreen';
import reducer from './reducers';

export const screens = {
  PeopleListScreen,
  PeopleDetailsScreen,
};

export { reducer };
