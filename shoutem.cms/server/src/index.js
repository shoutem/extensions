import { createDenormalizer } from 'denormalizer';
import { store } from 'context';
import CmsPage from './pages/cmsPage';
import reducer from './reducer';

const adminPages = {
  CmsPage,
};

export { adminPages, reducer };

createDenormalizer(store.getState);
