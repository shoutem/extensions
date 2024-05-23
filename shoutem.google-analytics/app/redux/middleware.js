import analytics from '@react-native-firebase/analytics';
import {
  ANALYTICS_OUT_MIDDLEWARE_PRIORITY,
  createEventsMiddleware,
  createScreenViewMiddleware,
} from 'shoutem.analytics';
import { isProduction } from 'shoutem.application';
import { setPriority } from 'shoutem-core';

function trackScreenView(action) {
  if (!isProduction()) {
    return;
  }

  const { title, payload } = action;
  const screenName = title || payload?.screen;

  const params = {
    screenName,
    ...payload,
  };

  analytics().logEvent('shoutem_screen_view', params);
  analytics().logScreenView({
    screen_name: screenName,
    screen_class: payload?.screen,
  });
}
setPriority(trackScreenView, ANALYTICS_OUT_MIDDLEWARE_PRIORITY);

function trackEvents(action) {
  if (!isProduction()) {
    return;
  }

  const { resource, payload, action: eventId } = action;
  const params = { resource, ...payload };

  // No spaces allowed in custom event names
  const eventName = eventId.replace(/ /g, '_');

  analytics().logEvent(eventName, params);
}
setPriority(trackEvents, ANALYTICS_OUT_MIDDLEWARE_PRIORITY);

export default [
  createScreenViewMiddleware(trackScreenView),
  createEventsMiddleware(trackEvents),
];
