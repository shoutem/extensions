import React from 'react';
import { Platform } from 'react-native';
import AdMob, { TestIds } from '@react-native-admob/admob';
import _ from 'lodash';
import { getExtensionSettings } from 'shoutem.application/redux';
import { MAIN_NAVIGATION_SCREEN_TYPES } from 'shoutem.navigation';
import { isPreviewApp } from 'shoutem.preview';
import { after, priorities, setPriority } from 'shoutem-core';
import { ext } from './const';
import { AdProvider } from './providers';

let ads;

function formatContextData(extensionSettings, appScreens) {
  const {
    iOSBannerAdId,
    AndroidBannerAdId,
    iOSAdAppId,
    AndroidAdAppId,
    keywords,
    iOSInterstitialAdId,
    AndroidInterstitialAdId,
  } = extensionSettings;

  const isIOS = Platform.OS === 'ios';
  const iOSConfigured = (iOSBannerAdId || iOSInterstitialAdId) && iOSAdAppId;
  const AndroidConfigured =
    (AndroidBannerAdId || AndroidInterstitialAdId) && AndroidAdAppId;

  const isConfigured = isIOS ? iOSConfigured : AndroidConfigured;

  if (!isConfigured) {
    return;
  }

  const liveBannerAdId = isIOS ? iOSBannerAdId : AndroidBannerAdId;
  const liveInterstitialAdId = isIOS
    ? iOSInterstitialAdId
    : AndroidInterstitialAdId;
  const bannerAdId = isPreviewApp ? TestIds.BANNER : liveBannerAdId;
  const interstitialAdId = isPreviewApp
    ? TestIds.INTERSTITIAL
    : liveInterstitialAdId;

  const disabledBanner = _.reduce(
    appScreens,
    (result, screen) => {
      if (screen.attributes.settings?.disableAdBanner) {
        result.push(screen.attributes.canonicalName);
      }

      return result;
    },
    [...MAIN_NAVIGATION_SCREEN_TYPES, 'root_layout'],
  );

  ads = {
    bannerAdId,
    interstitialAdId,
    keywords,
    disabledBanner,
  };
}

export const appDidMount = setPriority(app => {
  const store = app.getStore();
  const state = store.getState();
  const extensionSettings = getExtensionSettings(state, ext());
  const {
    maxAdContentRating,
    tagForChildDirectedTreatment,
    tagForUnderAgeOfConsent,
  } = extensionSettings;
  const appScreens = state['shoutem.application'].screens;

  formatContextData(extensionSettings, appScreens);

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
  return <AdProvider context={ads}>{children}</AdProvider>;
}
