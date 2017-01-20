import {
  JUMP_TO_INITIAL_TAB,
} from './actionTypes';

// Jump to initial tab within the TabBar
export function jumpToInitialTabBarTab() {
  return {
    type: JUMP_TO_INITIAL_TAB,
  };
}
