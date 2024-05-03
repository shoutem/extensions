import React from 'react';
import { BannerAd, BannerAdSize } from 'react-native-google-mobile-ads';
import _ from 'lodash';
import { BANNER_REQUEST_OPTIONS } from '../const';
import { AdContext } from '../providers';

export function Banner(props) {
  return (
    <AdContext.Consumer>
      {context => {
        const adUnitId = _.get(context, 'bannerAdId');

        if (!adUnitId) {
          return null;
        }

        return (
          <BannerAd
            size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
            unitId={adUnitId}
            requestOptions={BANNER_REQUEST_OPTIONS}
            {...props}
          />
        );
      }}
    </AdContext.Consumer>
  );
}
