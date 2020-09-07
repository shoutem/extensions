import { activateChatModule, loadAppModules } from './actions';
import { getInstalledModules, isChatModuleActive } from './selectors';
export { default as reducer } from './reducer';

export const actions = {
  activateChatModule,
  loadAppModules,
};

export const selectors = {
  getInstalledModules,
  isChatModuleActive,
};
