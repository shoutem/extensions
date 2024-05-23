import { trackEvent as builderTrackEvent } from 'environment';
import _ from 'lodash';

export async function trackEvent(category, action, label, value) {
  if (_.isFunction(builderTrackEvent)) {
    await builderTrackEvent(category, action, label, value);
  }
}
