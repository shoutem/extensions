import { combineReducers } from 'redux';
import { preventStateRehydration } from '@shoutem/core/preventStateRehydration';
import tabBar from './tabBar';
import drawer from './drawer';
import modal from './modal';

const reducer = combineReducers({
  tabBar,
  drawer,
  modal,
});
export default preventStateRehydration(reducer);
export {
  TAB_BAR_NAVIGATION_STACK,
  getTabNavigationStack,
  getTabNavigationStateFromTabBarState,
  getTabNavigationState,
} from './tabBar';

export {
  jumpToInitialTabBarTab,
} from './actions';

export {
  DRAWER_NAVIGATION_STACK,
} from './drawer';

export {
  MODAL_NAVIGATION_STACK,
} from './modal';

export { default as middleware } from './middleware';
