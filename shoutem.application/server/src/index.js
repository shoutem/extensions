// This file is managed by Shoutem CLI
// It exports pages from extension.json
// You should not change it manually

// screens imports
import { AppSettingsPage } from './pages/app-settings-page';
import { AppAnalyticsPage } from './pages/app-analytics-page';

import { reducer } from './redux';
import { shoutemUrls } from './services';

export const pages = {
  AppSettingsPage,
  AppAnalyticsPage,
};

// eslint-disable-next-line import/no-mutable-exports
let pageReducer = null;

export function pageWillMount(page) {
  pageReducer = reducer();
  shoutemUrls.init(page);
}

export { pageReducer as reducer };
