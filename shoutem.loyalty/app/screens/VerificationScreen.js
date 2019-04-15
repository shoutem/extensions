import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import _ from 'lodash';
import { Dimensions } from 'react-native';
import { connect } from 'react-redux';
import QRCode from 'react-native-qrcode';

import { NavigationBar, navigateTo } from 'shoutem.navigation';
import {
  Button,
  Screen,
  Subtitle,
  Text,
  View,
} from '@shoutem/ui';
import { connectStyle } from '@shoutem/theme';

import {
  loginRequired,
} from 'shoutem.auth';
import { I18n } from 'shoutem.i18n';

import { ext } from '../const';

import {
  getCardId,
  isPunchCard,
} from '../redux';

import { placeShape, rewardShape } from '../components/shapes';

const { bool, func, string } = PropTypes;

/**
 * Encodes reward values in an array to save space in QR code.
 */
const getEncodedRewardValues = (reward) => {
  const {
    id,
    location = '',
    parentCategoryId,
    points,
    pointsRequired,
    title,
    numberOfRewards,
  } = reward;

  return [
    id,
    location,
    isPunchCard(reward),
    parentCategoryId,
    points,
    pointsRequired,
    title,
    numberOfRewards,
  ];
};

/**
 * Shows points card details for a single card loyalty program
 */
export class VerificationScreen extends PureComponent {
  static propTypes = {
    // User's loyalty card ID
    cardId: string,
    // Navigates to PIN verification screen
    navigateTo: func,
    // Where the transaction takes place
    place: placeShape,
    // Reward being stamped or redeemed
    reward: rewardShape,
    // True if he user want to redeem a reward, false otherwise
    redeem: bool,
  };

  constructor(props) {
    super(props);

    this.navigateToPinVerificationScreen = this.navigateToPinVerificationScreen.bind(this);
  }

  navigateToPinVerificationScreen() {
    const { navigateTo, place, reward, redeem } = this.props;

    navigateTo({
      screen: ext('PinVerificationScreen'),
      props: {
        place,
        reward,
        redeem,
      },
    });
  }

  render() {
    const { cardId, reward, redeem, place, style } = this.props;

    const rewardData = reward ? getEncodedRewardValues(reward) : '';
    const placeId = _.get(place, 'id');

    const transactionData = [cardId, placeId, rewardData, redeem];

    // qr code size is 80% of available screen space
    const qrCodeWidth =
      _.min([Dimensions.get('window').width, Dimensions.get('window').height]) * 0.8;

    return (
      <Screen>
        <NavigationBar />
        <View
          styleName="sm-gutter flexible vertical h-center v-center"
        >
          <Subtitle styleName="xl-gutter-bottom">{I18n.t(ext('cashierVerificationMessage'))}</Subtitle>
          <View
            style={style.qrBackground}
            styleName="md-gutter-vertical md-gutter-horizontal"
          >
            <QRCode
              size={qrCodeWidth}
              value={JSON.stringify(transactionData)}
            />
          </View>
          <Button
            styleName="secondary md-gutter-vertical"
            onPress={this.navigateToPinVerificationScreen}
          >
            <Text>{I18n.t(ext('usePinInstead'))}</Text>
          </Button>
        </View>
      </Screen>
    );
  }
}

export const mapStateToProps = (state) => {
  return {
    cardId: getCardId(state),
  };
};

export default loginRequired(connect(mapStateToProps, { navigateTo })(
  connectStyle(ext('VerificationScreen'))(VerificationScreen),
));
