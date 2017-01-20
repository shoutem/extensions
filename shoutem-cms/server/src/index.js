import CmsPage from './cmsPage/components/Cms';
import CmsSettingsPage from './settingsPage';
import reducer from './reducer';
import { createDenormalizer } from 'denormalizer';
import { store } from 'context';

const adminPages = {
  CmsPage,
  CmsSettingsPage,
};

export {
  adminPages,
  reducer,
};

createDenormalizer(store.getState);
