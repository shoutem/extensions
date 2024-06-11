import { invalidate } from '@shoutem/redux-io';
import { createLocaleChangedMiddleware } from 'shoutem.i18n';
import { schema } from '../const';

export const localeChangedMiddleware = createLocaleChangedMiddleware(store =>
  store.dispatch(invalidate(schema)),
);
