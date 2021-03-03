import { find } from '@shoutem/redux-io';
import ext from 'src/const';
import { shoutemUrls } from 'src/services';
import { MAX_PAGE_LIMIT, USER_GROUPS } from '../const';

export function loadAllUserGroups(appId) {
  const config = {
    schema: USER_GROUPS,
    request: {
      endpoint: shoutemUrls.buildAuthUrl(`/v1/realms/externalReference:${appId}/groups{?q*}`),
      headers: {
        Accept: 'application/vnd.api+json',
      },
    },
  };

  const params = {
    q: {
      'page[limit]': MAX_PAGE_LIMIT,
    },
  };

  return find(config, ext('allUserGroups'), params);
}
