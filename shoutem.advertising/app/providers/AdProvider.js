import React, { useEffect, useMemo } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import {
  AdEventType,
  BannerAd,
  BannerAdSize,
  InterstitialAd,
  TestIds,
} from 'react-native-google-mobile-ads';
import { useSelector } from 'react-redux';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { getExtensionSettings } from 'shoutem.application';
import { MAIN_NAVIGATION_SCREEN_TYPES } from 'shoutem.navigation';
import { isPreviewApp } from 'shoutem.preview';
import { BANNER_REQUEST_OPTIONS, ext } from '../const';

const isIOS = Platform.OS === 'ios';

export const AdContext = React.createContext();

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

const resolveContextData = (extensionSettings, appScreens) => {
  const {
    iOSBannerAdId,
    AndroidBannerAdId,
    iOSAdAppId,
    AndroidAdAppId,
    keywords,
    iOSInterstitialAdId,
    AndroidInterstitialAdId,
  } = extensionSettings;

  const iOSConfigured = (iOSBannerAdId || iOSInterstitialAdId) && iOSAdAppId;
  const AndroidConfigured =
    (AndroidBannerAdId || AndroidInterstitialAdId) && AndroidAdAppId;

  const isConfigured = isIOS ? iOSConfigured : AndroidConfigured;

  const liveBannerAdId = isIOS ? iOSBannerAdId : AndroidBannerAdId;
  const liveInterstitialAdId = isIOS
    ? iOSInterstitialAdId
    : AndroidInterstitialAdId;
  const bannerAdId = isPreviewApp ? TestIds.BANNER : liveBannerAdId;
  const interstitialAdId = isPreviewApp
    ? TestIds.INTERSTITIAL
    : liveInterstitialAdId;

  const exclusionList = _.reduce(
    appScreens,
    (result, screen) => {
      if (screen.attributes.settings?.disableAdBanner) {
        result.disabledBanner.push(screen.attributes.canonicalName);
      }
      if (screen.attributes.settings?.hasCustomAdRenderer) {
        result.customBanner.push(screen.attributes.canonicalName);
      }

      return result;
    },
    {
      disabledBanner: [...MAIN_NAVIGATION_SCREEN_TYPES, 'root_layout'],
      customBanner: [],
    },
  );

  const renderBanner = () => (
    <BannerAd
      size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
      unitId={bannerAdId}
      requestOptions={BANNER_REQUEST_OPTIONS}
    />
  );

  return {
    bannerAdId,
    interstitialAdId,
    keywords,
    disabledBannerScreens: exclusionList.disabledBanner,
    customBannerScreens: exclusionList.customBanner,
    renderBanner: isConfigured ? renderBanner : () => null,
    isConfigured,
  };
};

const AdProvider = ({ children }) => {
  const appScreens = useSelector(state => state['shoutem.application'].screens);
  const extensionSettings = useSelector(state =>
    getExtensionSettings(state, ext()),
  );

  const context = useMemo(
    // Extract and format context data.
    () => resolveContextData(extensionSettings, appScreens),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  // Load interstitial Ad after context data has been set.
  // Note that interstitial Ad won't show in dev mode, unless you explicitly assign TestIds.INTERSTITIAL id.
  useEffect(() => {
    if (!context?.isConfigured || !context?.interstitialAdId) {
      return;
    }

    const parsedKeywords = _.isEmpty(context?.keywords)
      ? []
      : _.split(context?.keywords, ',');

    const interstitial = InterstitialAd.createForAdRequest(
      context?.interstitialAdId,
      {
        keywords: parsedKeywords,
        requestNonPersonalizedAdsOnly: true,
      },
    );

    const unsubscribe = interstitial.addAdEventListener(
      AdEventType.LOADED,
      () => interstitial.show(),
    );

    interstitial.load();

    // eslint-disable-next-line consistent-return
    return unsubscribe;
  }, [context]);

  return (
    <AdContext.Provider value={context}>
      <View style={styles.container}>{children}</View>
    </AdContext.Provider>
  );
};

AdProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AdProvider;
