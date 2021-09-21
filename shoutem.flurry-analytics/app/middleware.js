import { setPriority } from 'shoutem-core';

import {
  createScreenViewMiddleware,
  createEventsMiddleware,
  ANALYTICS_OUT_MIDDLEWARE_PRIORITY,
} from 'shoutem.analytics';

import Flurry from 'react-native-flurry-sdk';

import { isFlurryActive } from './services/flurry';

function trackScreenView(action, store) {
  if (!isFlurryActive(store.getState())) {
    return;
  }

  const screenName = action.title || action.screen;

  Flurry.logEvent('Screen view', { screenName });
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
