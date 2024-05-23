import { ext } from 'context';
import { appId, url } from 'environment';
import Uri from 'urijs';
import { find } from '@shoutem/redux-io';
import { MODULES } from '../types';

export function loadModules() {
  const uri = new Uri()
    .protocol('')
    .host(url.apps)
    .segment(['v1', 'apps', appId, 'modules'])
    .toString();

  const config = {
    schema: MODULES,
    request: {
      endpoint: uri,
      headers: {
        Accept: 'application/vnd.api+json',
      },
    },
  };

  return find(config, ext('all-modules'));
}
