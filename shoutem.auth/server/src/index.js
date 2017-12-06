import SettingsPage from './pages/settings-page';
import ProvidersPage from './pages/providers-page';
import MembersPage from './pages/members-page';
import reducer from './redux';
import { shoutemUrls } from './services';
import './style.scss';

export const pages = {
  SettingsPage,
  ProvidersPage,
  MembersPage,
};

let pageReducer = null;

export function pageWillMount(page) {
  pageReducer = reducer();
  shoutemUrls.init(page);
}

export { pageReducer as reducer };
