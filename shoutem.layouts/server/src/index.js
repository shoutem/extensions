import LayoutPage from './layoutPage/components';
import reducer from './reducer';
import { createDenormalizer } from 'denormalizer';
import { store } from 'context';

const adminPages = {
  LayoutPage,
};

export { adminPages, reducer };

createDenormalizer(store.getState);
