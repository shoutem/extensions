import { store } from 'context';
import { createDenormalizer } from 'denormalizer';
import CmsPage from './pages/cmsPage';
import LayoutSettingsPage from './pages/layout-settings-page';
import reducer from './reducer';

const adminPages = {
  CmsPage,
  LayoutSettingsPage,
};

export { adminPages, reducer };

createDenormalizer(store.getState);
