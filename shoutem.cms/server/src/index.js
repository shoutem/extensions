import { createDenormalizer } from 'denormalizer';
import { store } from 'context';
import CmsPage from './pages/cmsPage';
import CmsSettingsPage from './pages/settingsPage';
import reducer from './reducer';

const adminPages = {
  CmsPage,
  CmsSettingsPage,
};

export { adminPages, reducer };

createDenormalizer(store.getState);
