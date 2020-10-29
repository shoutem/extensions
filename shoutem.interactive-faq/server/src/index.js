import { createDenormalizer } from 'denormalizer';
import FaqSettings from './pages/settingsPage';
import reducer from './reducer';

const adminPages = {
  FaqSettings,
};

export { adminPages, reducer };

export function extensionDidLoad(builder) {
  const getState = builder.getStore().getState;

  createDenormalizer(getState);
}
