// Constants `screens`, `actions` and `reducer` are exported via named export
// It is important to use those exact names

import {
  RewardsSettingsPage,
  LoyaltySettingsPage,
  PointsCardSettingsPage,
  TransactionsPage,
} from './pages';
import { cmsApi } from './modules/cms';
import { shoutemUrls } from './services';
import './style.scss';

import { reducer } from './redux';

export const pages = {
  RewardsSettingsPage,
  LoyaltySettingsPage,
  PointsCardSettingsPage,
  TransactionsPage,
};

let pageReducer = null;

export function pageWillMount(page) {
  cmsApi.initSession(page);
  shoutemUrls.init(page);

  pageReducer = reducer();
}

export { pageReducer as reducer };
