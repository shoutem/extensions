import _ from 'lodash';
import { Toast } from '@shoutem/ui';
import { isWeb } from 'shoutem-core';

export const resolveUnavailableText = featureText =>
  `${featureText} currently unavailable in Web Preview. For better preview experience download the Disclose app.`;

export const unavailableInWeb = (callback, customMessage) => {
  if (!isWeb) {
    return callback;
  }

  // If callback is undefined, show toast immediatelly.
  if (!callback) {
    Toast.showInfo({
      title: 'Feature currently unavailable',
      message: customMessage ?? resolveUnavailableText('This feature is'),
    });
  }

  // Otherwise, return callback to be executed on user action.
  return () =>
    Toast.showInfo({
      title: 'Feature currently unavailable',
      message: customMessage ?? resolveUnavailableText('This feature is'),
    });
};
