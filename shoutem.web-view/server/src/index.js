import WebPage from './webPage';
import reducer from './reducer';
import { createDenormalizer } from 'denormalizer';

const adminPages = {
  WebPage,
};

export { adminPages, reducer };

export function extensionDidLoad(builder) {
  const getState = builder.getStore().getState;
  createDenormalizer(getState);
}
