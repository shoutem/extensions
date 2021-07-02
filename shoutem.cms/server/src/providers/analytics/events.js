import _ from 'lodash';
import { trackEvent as builderTrackEvent } from 'environment';

export async function trackEvent(category, action, label, value) {
  if (_.isFunction(builderTrackEvent)) {
    await builderTrackEvent(category, action, label, value);
  }
}
