import { find } from '@shoutem/redux-io';
import { shoutemUrls } from '../services';

export function loadSchema(appId, schema, tag = 'schema') {
  const config = {
    schema: 'shoutem.core.schemas',
    request: {
      endpoint: shoutemUrls.buildLegacyUrl(
        `v1/apps/${appId}/schemas/${schema}`,
      ),
      headers: {
        Accept: 'application/vnd.api+json',
      },
    },
  };

  return find(config, tag);
}
