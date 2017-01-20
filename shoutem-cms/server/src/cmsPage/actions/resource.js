import { url, appId } from 'environment';
import { find } from '@shoutem/redux-io';
import { ext } from 'context';
import { CURRENT_SCHEMA } from './../../types';

export function loadResources(categoryId) {
  const queryParams = { 'filter[categories]': categoryId };

  const config = {
    schema: CURRENT_SCHEMA,
    request: {
      endpoint: `//${url.legacy}/v1/apps/${appId}/resources/${CURRENT_SCHEMA}`,
      headers: {
        Accept: 'application/vnd.api+json',
      },
    },
  };


  return find(config, ext('all'), queryParams);
}
