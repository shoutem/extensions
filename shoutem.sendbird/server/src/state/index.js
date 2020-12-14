import {
  activateChatModule,
  loadAppModules,
  validateSubscriptionStatus,
  deactivateChatModule,
} from './actions';
import {
  getInstalledModules,
  isChatModuleActive,
  getChatModule,
} from './selectors';

export { default as reducer } from './reducer';

export const actions = {
  activateChatModule,
  loadAppModules,
  validateSubscriptionStatus,
  deactivateChatModule,
};

export const selectors = {
  getInstalledModules,
  isChatModuleActive,
  getChatModule,
};
