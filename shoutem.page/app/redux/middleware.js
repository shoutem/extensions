import { invalidate } from '@shoutem/redux-io';
import { createLocaleChangedMiddleware } from 'shoutem.i18n';
import { PAGE_SCHEMA } from '../const';

export const localeChangedMiddleware = createLocaleChangedMiddleware(store =>
  store.dispatch(invalidate(PAGE_SCHEMA)),
);
