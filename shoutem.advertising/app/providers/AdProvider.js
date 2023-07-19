import React, { PureComponent } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { connect } from 'react-redux';
import {
  BannerAd,
  BannerAdSize,
  InterstitialAd,
  TestIds,
} from '@react-native-admob/admob';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { getExtensionSettings } from 'shoutem.application';
import { MAIN_NAVIGATION_SCREEN_TYPES } from 'shoutem.navigation';
import { isPreviewApp } from 'shoutem.preview';
import { BANNER_REQUEST_OPTIONS, ext } from '../const';

export const AdContext = React.createContext();

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

class AdProvider extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      context: undefined,
    };
  }

  componentDidMount() {
    const { extensionSettings, appScreens } = this.props;
    const {
      iOSBannerAdId,
      AndroidBannerAdId,
      iOSAdAppId,
      AndroidAdAppId,
      keywords,
      iOSInterstitialAdId,
      AndroidInterstitialAdId,
    } = extensionSettings;

    // Extract and format context data
    const isIOS = Platform.OS === 'ios';
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
        size={BannerAdSize.ADAPTIVE_BANNER}
        unitId={bannerAdId}
        requestOptions={BANNER_REQUEST_OPTIONS}
      />
    );

    // Run initial interstitial ad if the settings are present
    if (isConfigured && interstitialAdId) {
      const parsedKeywords = _.isEmpty(keywords) ? [] : _.split(keywords, ',');
      this.interstitial = InterstitialAd.createAd(interstitialAdId, {
        loadOnMounted: false,
        requestOptions: {
          requestNonPersonalizedAdsOnly: true,
          keywords: parsedKeywords,
        },
      });

      this.interstitial.addEventListener('adLoaded', () => {
        this.interstitial.show();
      });

      this.interstitial.load();
    }

    // Set Context data
    this.setState({
      context: {
        bannerAdId,
        interstitialAdId,
        keywords,
        disabledBannerScreens: exclusionList.disabledBanner,
        customBannerScreens: exclusionList.customBanner,
        renderBanner: isConfigured ? renderBanner : () => null,
        isConfigured,
      },
    });
  }

  componentWillUnmount() {
    if (this.interstitial) {
      this.interstitial.removeAllListeners();
    }
  }

  render() {
    const { children } = this.props;
    const { context } = this.state;

    return (
      <AdContext.Provider value={context}>
        <View style={styles.container}>{children}</View>
      </AdContext.Provider>
    );
  }
}

const mapStateToProps = state => ({
  extensionSettings: getExtensionSettings(state, ext()),
  appScreens: state['shoutem.application'].screens,
});

AdProvider.propTypes = {
  appScreens: PropTypes.object.isRequired,
  children: PropTypes.node.isRequired,
  extensionSettings: PropTypes.object.isRequired,
};

export default connect(mapStateToProps)(AdProvider);
