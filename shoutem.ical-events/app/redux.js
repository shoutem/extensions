import _ from 'lodash';
import { combineReducers } from 'redux';
import { mapReducers } from '@shoutem/redux-composers';
import { collection, getCollection, storage } from '@shoutem/redux-io';
import adaptEventAttributes from './services/eventAdapter';
import { ext } from './const';

export const EVENTS_PROXY_SCHEMA = 'shoutem.proxy.ical.events';

const isIcalItem = item =>
  item?.meta?.schema === EVENTS_PROXY_SCHEMA &&
  item?.type === '@@redux_io/OBJECT_FETCHED';

// We're trying to mutate the server sent payload here, in order
// to caluclate start & end times. Target only RIO actions that are
// sending batch updates with at least one item being of iCal type.
export const parseICalMiddleware = () => next => action => {
  if (
    action.type === 'BATCHING_REDUCER.BATCH' &&
    !!_.find(action.payload, isIcalItem)
  ) {
    return next({
      ...action,
      payload: _.map(action.payload, item => ({
        ...item,
        payload: isIcalItem(item)
          ? {
              ...item.payload,
              attributes: adaptEventAttributes(item.payload.attributes),
            }
          : item.payload,
      })),
    });
  }

  return next(action);
};

function getIcalUrl(action) {
  return _.get(action, ['meta', 'params', 'query', 'url']);
}

const _15min = 15 * 60;

export function icalFeed(schema) {
  return mapReducers(
    getIcalUrl,
    collection(schema, 'urlSpecificEvents', { expirationTime: _15min }),
  );
}

export default combineReducers({
  events: storage(EVENTS_PROXY_SCHEMA),
  urlSpecificEvents: icalFeed(EVENTS_PROXY_SCHEMA),
});

export function getIcalFeed(state, icalUrl) {
  return getCollection(state[ext()].urlSpecificEvents[icalUrl], state);
}
