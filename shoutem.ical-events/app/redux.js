import _ from 'lodash';
import { combineReducers } from 'redux';
import { storage, collection, getCollection } from '@shoutem/redux-io';
import { mapReducers, TARGET_ALL_REDUCERS } from '@shoutem/redux-composers';
import adaptEventAttributes from './services/eventAdapter';
import { ext } from './extension';

export const EVENTS_PROXY_SCHEMA = 'shoutem.proxy.ical.events';

const eventsStorage = storage(EVENTS_PROXY_SCHEMA);

function events(state, action) {
  const storedEvents = eventsStorage(state, action);

  _.forEach(storedEvents, storedEvent => {
    if (storedEvent.attributes) {
      storedEvent.attributes = adaptEventAttributes(storedEvent.attributes);
    }
  });

  return storedEvents;
}

function getIcalUrl(action) {
  return _.get(action, ['meta', 'params', 'query', 'url']);
}

const _15min = 15 * 60;

export function icalFeed(schema) {
  return mapReducers(
    getIcalUrl,
    collection(schema, 'urlSpecificEvents', { expirationTime: _15min })
  );
}

export default combineReducers({
  events,
  urlSpecificEvents: icalFeed(EVENTS_PROXY_SCHEMA),
});

export function getIcalFeed(state, icalUrl) {
  return getCollection(state[ext()].urlSpecificEvents[icalUrl], state);
}
