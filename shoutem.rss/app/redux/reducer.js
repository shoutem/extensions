import _ from 'lodash';
import { REHYDRATE } from 'redux-persist/constants';
import { mapReducers } from '@shoutem/redux-composers';
import { collection } from '@shoutem/redux-io';

function getFeedUrl(action) {
  return _.get(action, ['meta', 'params', 'query', 'filter[url]']);
}

const _15min = 15 * 60;

export default function rssFeed(schema, tag) {
  return (state = [], action) => {
    // Prevent all rssFeed reducers from executing mapReducers, execute only
    // for own schema
    if (action.meta?.schema !== schema && action.type !== REHYDRATE) {
      return state;
    }

    return mapReducers(
      getFeedUrl,
      collection(schema, tag, { expirationTime: _15min }),
    )(state, action);
  };
}
