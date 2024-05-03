import { find } from '@shoutem/redux-io';
import { getAppId, getExtensionServiceUrl } from 'shoutem.application';
import { navigateTo } from 'shoutem.navigation';
import { DEALS_SCHEMA, ext } from '../const';

const MAX_PAGE_SIZE = 10;

export const fetchPlaceDeals = placeId => (dispatch, getState) => {
  const state = getState();
  const cmsUrl = getExtensionServiceUrl(state, ext(), 'cms');
  const todayStr = new Date().toISOString();

  // Notice there's no categoryId - we're searching all Deals collections (shortcuts) for deals related to this place.
  const params = {
    query: {
      'page[limit]': MAX_PAGE_SIZE,
      sort: 'endTime',
      'filter[place.id]': placeId,
      'filter[available]': 1,
      'filter[publishTime][lt]': todayStr,
      'filter[endTime][gt]': todayStr,
    },
  };

  const config = {
    schema: DEALS_SCHEMA,
    request: {
      endpoint: `${cmsUrl}/v1/apps/${getAppId()}/resources/${DEALS_SCHEMA}{?query*}`,
      headers: {
        Accept: 'application/vnd.api+json',
      },
    },
  };

  return dispatch(find(config, ext('deals'), params));
};

export function openPlacesList() {
  return navigateTo(ext('IconPlacesList'));
}
