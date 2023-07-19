import React from 'react';
import AdMob from '@react-native-admob/admob';
import { getExtensionSettings } from 'shoutem.application/redux';
import { after, priorities, setPriority } from 'shoutem-core';
import { ext } from './const';
import { AdProvider } from './providers';

export const appDidMount = setPriority(app => {
  const store = app.getStore();
  const state = store.getState();
  const extensionSettings = getExtensionSettings(state, ext());
  const {
    maxAdContentRating,
    tagForChildDirectedTreatment,
    tagForUnderAgeOfConsent,
  } = extensionSettings;

  AdMob.setRequestConfiguration({
    // Update all future requests suitable for parental guidance
    maxAdContentRating,

    // Indicates that you want your content treated as child-directed for purposes of COPPA.
    tagForChildDirectedTreatment,

    // Indicates that you want the ad request to be handled in a
    // manner suitable for users under the age of consent.
    tagForUnderAgeOfConsent,
  });
}, after(priorities.INIT));

export function renderProvider(children) {
  return <AdProvider>{children}</AdProvider>;
}
