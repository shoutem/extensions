import {
  activateChatModule,
  loadAppModules,
  validateSubscriptionStatus,
} from './actions';
import { getInstalledModules, isChatModuleActive } from './selectors';

export { default as reducer } from './reducer';

export const actions = {
  activateChatModule,
  loadAppModules,
  validateSubscriptionStatus,
};

export const selectors = {
  getInstalledModules,
  isChatModuleActive,
};
