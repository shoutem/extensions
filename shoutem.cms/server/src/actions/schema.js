import { ext } from 'context';
import { appId, url } from 'environment';
import { find } from '@shoutem/redux-io';
import { CURRENT_SCHEMA, SCHEMAS } from '../types';

export function loadSchema(schema = CURRENT_SCHEMA, tag = 'schema') {
  const config = {
    schema: SCHEMAS,
    request: {
      endpoint: `//${url.legacy}/v1/apps/${appId}/schemas/${schema}`,
      headers: {
        Accept: 'application/vnd.api+json',
      },
    },
  };

  return find(config, ext(tag));
}
