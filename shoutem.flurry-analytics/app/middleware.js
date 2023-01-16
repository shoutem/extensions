import Flurry from 'react-native-flurry-sdk';
import {
  ANALYTICS_OUT_MIDDLEWARE_PRIORITY,
  createEventsMiddleware,
  createScreenViewMiddleware,
} from 'shoutem.analytics';
import { setPriority } from 'shoutem-core';
import { isFlurryActive } from './services/flurry';

function trackScreenView(action, store) {
  if (!isFlurryActive(store.getState())) {
    return;
  }

  const { title, screen, payload } = action;
  const params = {
    screenName: title || screen,
    ...payload,
  };

  Flurry.logEvent('Screen view', params);
}
setPriority(trackScreenView, ANALYTICS_OUT_MIDDLEWARE_PRIORITY);

function trackEvents(action, store) {
  if (!isFlurryActive(store.getState())) {
    return;
  }

  const { resource, payload, action: eventId } = action;
  const params = { resource, ...payload };

  Flurry.logEvent(eventId, params);
}
setPriority(trackEvents, ANALYTICS_OUT_MIDDLEWARE_PRIORITY);

export default [
  createScreenViewMiddleware(trackScreenView),
  createEventsMiddleware(trackEvents),
];
