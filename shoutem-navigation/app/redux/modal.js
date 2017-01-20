import { createNavigationReducer } from '@shoutem/core/navigation';

import { ext } from '../const';

export const MODAL_NAVIGATION_STACK = {
  name: ext('Modal'),
  statePath: [ext(), 'modal'],
};
export default createNavigationReducer(MODAL_NAVIGATION_STACK.name);
