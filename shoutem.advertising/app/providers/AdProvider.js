import React, { PureComponent } from 'react';
import _ from 'lodash';
import { View, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import { InterstitialAd, AdEventType } from '@react-native-firebase/admob';

export const AdContext = React.createContext();

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export class AdProvider extends PureComponent {
  static propTypes = {
    children: PropTypes.node,
    context: PropTypes.object,
  };

  componentDidUpdate(prevProps) {
    const { context } = this.props;
    const { context: prevContext } = prevProps;

    const interstitialAdId = _.get(context, 'interstitialAdId');

    if (!context || !interstitialAdId) {
      return;
    }

    const { keywords } = context;

    if (!prevContext && context) {
      const parsedKeywords = _.isEmpty(keywords) ? [] : _.split(keywords, ',');
      this.interstitial = InterstitialAd.createForAdRequest(interstitialAdId, {
        requestNonPersonalizedAdsOnly: true,
        keywords: parsedKeywords,
      });

      this.removeAdListener = this.interstitial.onAdEvent(type => {
        if (type === AdEventType.LOADED) {
          this.interstitial.show();
        }
      });

      this.interstitial.load();
    }
  }

  componentWillUnmount() {
    if (this.removeAdListener) {
      this.removeAdListener();
    }
  }

  render() {
    const { children, context } = this.props;

    return (
      <AdContext.Provider value={context}>
        <View style={styles.container}>{children}</View>
      </AdContext.Provider>
    );
  }
}
