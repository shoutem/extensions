import _ from 'lodash';
import { combineReducers } from 'redux';
import { storage, collection } from '@shoutem/redux-io';
import adaptEventAttributes from './services/eventAdapter';

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

export default combineReducers({
  events,
  allEvents: collection(EVENTS_PROXY_SCHEMA, 'allEvents'),
});
