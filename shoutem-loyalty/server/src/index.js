// Constants `screens`, `actions` and `reducer` are exported via named export
// It is important to use those exact names

import LoyaltySettingsPage from './pages/loyalty-settings-page';
import PointsCardSettingsPage from './pages/points-card-settings-page';

import reducer from './redux';

export const pages = {
  LoyaltySettingsPage,
  PointsCardSettingsPage,
};

let pageReducer = null;

export function pageWillMount(page) {
  pageReducer = reducer(page);
}

export { pageReducer as reducer };
