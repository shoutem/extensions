import { createDenormalizer } from 'denormalizer';
import reducer from './reducer';
import WebPage from './webPage';

const adminPages = {
  WebPage,
};

export { adminPages, reducer };

export function extensionDidLoad(builder) {
  const { getState } = builder.getStore();
  createDenormalizer(getState);
}
