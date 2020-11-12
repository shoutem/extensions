import React from 'react';
import _ from 'lodash';
import { BannerAd, BannerAdSize } from '@react-native-firebase/admob';
import { AdContext } from '../providers';

export function Banner(props) {
  return (
    <AdContext.Consumer>
      {context => {
        const adUnitId = _.get(context, 'ads.bannerAdId');

        if (!adUnitId) {
          return null;
        }

        return <BannerAd size={BannerAdSize.SMART_BANNER} unitId={adUnitId} {...props} />;
      }}
    </AdContext.Consumer>
  );
}
