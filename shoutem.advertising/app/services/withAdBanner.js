import React, { PureComponent } from 'react';
import { Platform } from 'react-native';
import { connect } from 'react-redux';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { BannerAd, BannerAdSize, TestIds } from '@react-native-firebase/admob';
import { isPreviewApp } from 'shoutem.preview';
import { getExtensionSettings } from 'shoutem.application';
import { View } from '@shoutem/ui';
import { ext, EXCLUDED_SCREENS } from '../const';

export function withAdBanner(WrappedComponent) {
  class AdComponent extends PureComponent {
    static propTypes = {
      extensionSettings: PropTypes.object,
    };

    render() {
      const { extensionSettings, route } = this.props;

      const {
        iOSBannerAdId,
        AndroidBannerAdId,
        bannerPlacement,
        iOSAdAppId,
        AndroidAdAppId,
      } = extensionSettings;

      const isIOS = Platform.OS === 'ios';
      const iOSConfigured = iOSBannerAdId && iOSAdAppId;
      const AndroidConfigured = AndroidBannerAdId && AndroidAdAppId;

      const isConfigured = isIOS ? iOSConfigured : AndroidConfigured;
      const isExcludedScreen = _.includes(EXCLUDED_SCREENS, route.name);

      if (
        !isConfigured ||
        WrappedComponent.adBannerDisabled ||
        isExcludedScreen
      ) {
        return <WrappedComponent {...this.props} />;
      }

      const liveBannerAdId = isIOS ? iOSBannerAdId : AndroidBannerAdId;
      const bannerAdId = isPreviewApp ? TestIds.BANNER : liveBannerAdId;
      const bannerPlacementTop = bannerPlacement === 'Top';

      return (
        <View styleName="flexible">
          {bannerPlacementTop && (
            <BannerAd size={BannerAdSize.SMART_BANNER} unitId={bannerAdId} />
          )}
          <WrappedComponent {...this.props} />
          {!bannerPlacementTop && (
            <BannerAd size={BannerAdSize.SMART_BANNER} unitId={bannerAdId} />
          )}
        </View>
      );
    }
  }

  const mapStateToProps = state => ({
    extensionSettings: getExtensionSettings(state, ext()),
  });

  return connect(mapStateToProps)(AdComponent);
}
