import React from 'react';
import { Platform } from 'react-native';
import { connect } from 'react-redux';
import { BannerAd, BannerAdSize, TestIds } from '@react-native-admob/admob';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { View } from '@shoutem/ui';
import { getExtensionSettings } from 'shoutem.application';
import { isPreviewApp } from 'shoutem.preview';
import { BANNER_REQUEST_OPTIONS, ext } from '../const';
import { AdContext } from '../providers';

export function withAdBanner(WrappedComponent) {
  function AdComponent(props) {
    const { extensionSettings, route } = props;

    const {
      iOSBannerAdId,
      AndroidBannerAdId,
      bannerPlacement,
      iOSAdAppId,
      AndroidAdAppId,
    } = extensionSettings;

    return (
      <AdContext.Consumer>
        {context => {
          const isIOS = Platform.OS === 'ios';
          const iOSConfigured = iOSBannerAdId && iOSAdAppId;
          const AndroidConfigured = AndroidBannerAdId && AndroidAdAppId;

          const isConfigured = isIOS ? iOSConfigured : AndroidConfigured;
          const isExcludedScreen = _.includes(
            context?.disabledBanner,
            route.name,
          );

          if (
            !isConfigured ||
            WrappedComponent.adBannerDisabled ||
            isExcludedScreen
          ) {
            return <WrappedComponent {...props} />;
          }

          const liveBannerAdId = isIOS ? iOSBannerAdId : AndroidBannerAdId;
          const bannerAdId = isPreviewApp ? TestIds.BANNER : liveBannerAdId;
          const bannerPlacementTop = bannerPlacement === 'Top';

          return (
            <View styleName="flexible">
              {bannerPlacementTop && (
                <BannerAd
                  size={BannerAdSize.ADAPTIVE_BANNER}
                  unitId={bannerAdId}
                  requestOptions={BANNER_REQUEST_OPTIONS}
                />
              )}
              <WrappedComponent {...props} />
              {!bannerPlacementTop && (
                <BannerAd
                  size={BannerAdSize.ADAPTIVE_BANNER}
                  unitId={bannerAdId}
                  requestOptions={BANNER_REQUEST_OPTIONS}
                />
              )}
            </View>
          );
        }}
      </AdContext.Consumer>
    );
  }

  const mapStateToProps = state => ({
    extensionSettings: getExtensionSettings(state, ext()),
  });

  AdComponent.propTypes = {
    extensionSettings: PropTypes.object.isRequired,
    route: PropTypes.object.isRequired,
  };

  return connect(mapStateToProps)(AdComponent);
}
