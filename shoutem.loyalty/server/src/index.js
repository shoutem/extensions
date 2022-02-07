// Constants `screens`, `actions` and `reducer` are exported via named export
// It is important to use those exact names

import { cmsApi } from './modules/cms';
import {
  DefaultLoyaltyShortcutSettingsPage,
  LoyaltySettingsPage,
  TransactionsPage,
} from './pages';
import { reducer } from './redux';
import { shoutemUrls } from './services';
import './style.scss';

export const pages = {
  LoyaltySettingsPage,
  DefaultLoyaltyShortcutSettingsPage,
  TransactionsPage,
};

let pageReducer = null;

export function pageWillMount(page) {
  cmsApi.initSession(page);
  shoutemUrls.init(page);

  pageReducer = reducer();
}

export { pageReducer as reducer };
