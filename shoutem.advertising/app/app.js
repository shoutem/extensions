import React from 'react';
import { Platform } from 'react-native';
import { priorities, setPriority, after } from 'shoutem-core';
import admob, { TestIds } from '@react-native-firebase/admob';
import { getExtensionSettings } from 'shoutem.application/redux';
import { isPreviewApp } from 'shoutem.preview';
import { AdProvider } from './providers';
import { ext } from './const';

let ads;

function formatContextData(extensionSettings) {
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

  ads = {
    bannerAdId,
    interstitialAdId,
    keywords,
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

  formatContextData(extensionSettings);

  admob().setRequestConfiguration({
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
