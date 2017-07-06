import { find } from '@shoutem/redux-io';
import { url, appId } from 'environment';
import { ext } from 'context';
import { SCHEMAS, CURRENT_SCHEMA } from '../types';

export function loadSchema() {
  const config = {
    schema: SCHEMAS,
    request: {
      endpoint: `//${url.legacy}/v1/apps/${appId}/schemas/${CURRENT_SCHEMA}`,
      headers: {
        Accept: 'application/vnd.api+json',
      },
    },
  };

  return find(config, ext('schema'));
}
