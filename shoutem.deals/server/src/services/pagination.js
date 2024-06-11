import _ from 'lodash';
import Uri from 'urijs';
import { getCollectionLink } from '@shoutem/redux-io/reducers/collection';

export function getCurrentPagingOffsetFromCollection(collection, limit) {
  const prevLink = getCollectionLink(collection, 'prev');

  if (prevLink) {
    const prevUri = new Uri(prevLink);
    const prevSearch = prevUri.search();
    const prevQuery = Uri.parseQuery(prevSearch);
    const prevOffset = _.get(prevQuery, 'page[offset]');

    if (prevOffset) {
      return _.toInteger(prevOffset) + limit;
    }
  }

  return 0;
}
