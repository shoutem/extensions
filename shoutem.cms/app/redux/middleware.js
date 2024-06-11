import { createLocaleChangedMiddleware } from 'shoutem.i18n';
import { invalidateLoadedCollections } from './actions';

export const changeLocaleMiddleware = createLocaleChangedMiddleware(store =>
  store.dispatch(invalidateLoadedCollections()),
);
