import RssPage from './pages/rssPage/components';
import reducer from './reducer';
import { createDenormalizer } from './denormalizer';
import { store } from 'context';

const adminPages = {
  RssPage,
};

export { adminPages, reducer };

createDenormalizer(store.getState);
