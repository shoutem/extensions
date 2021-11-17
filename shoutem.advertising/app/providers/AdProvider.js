import React, { PureComponent } from 'react';
import _ from 'lodash';
import { View, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import { InterstitialAd } from '@react-native-admob/admob';

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
  }

  componentWillUnmount() {
    if (this.interstitial) {
      this.interstitial.removeAllListeners();
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
