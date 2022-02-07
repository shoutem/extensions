import React, { PureComponent } from 'react';
import { Dimensions } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { connect } from 'react-redux';
import autoBindReact from 'auto-bind/react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { connectStyle } from '@shoutem/theme';
import { Button, Screen, Subtitle, Text, View } from '@shoutem/ui';
import { loginRequired } from 'shoutem.auth';
import { I18n } from 'shoutem.i18n';
import { getRouteParams, navigateTo } from 'shoutem.navigation';
import { placeShape, rewardShape } from '../components/shapes';
import { ext } from '../const';
import { getCardId, isPunchCard } from '../redux';

/**
 * Encodes reward values in an array to save space in QR code.
 */
const getEncodedRewardValues = reward => {
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
    cardId: PropTypes.string,
    // Where the transaction takes place
    place: placeShape,
    // Reward being stamped or redeemed
    reward: rewardShape,
    // True if he user want to redeem a reward, false otherwise
    redeem: PropTypes.bool,
  };

  constructor(props) {
    super(props);

    autoBindReact(this);
  }

  componentDidMount() {
    const { navigation } = this.props;

    navigation.setOptions({ title: '' });
  }

  navigateToPinVerificationScreen() {
    const { place, reward, redeem } = getRouteParams(this.props);

    navigateTo(ext('PinVerificationScreen'), {
      place,
      reward,
      redeem,
    });
  }

  render() {
    const { place, reward, redeem } = getRouteParams(this.props);
    const { cardId, style } = this.props;

    const rewardData = reward ? getEncodedRewardValues(reward) : '';
    const placeId = _.get(place, 'id');

    const transactionData = [cardId, placeId, rewardData, redeem];

    // qr code size is 80% of available screen space
    const qrCodeWidth =
      _.min([Dimensions.get('window').width, Dimensions.get('window').height]) *
      0.8;

    return (
      <Screen>
        <View styleName="sm-gutter flexible vertical h-center v-center">
          <Subtitle styleName="xl-gutter-bottom">
            {I18n.t(ext('cashierVerificationMessage'))}
          </Subtitle>
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

export const mapStateToProps = state => {
  return {
    cardId: getCardId(state),
  };
};

export default loginRequired(
  connect(mapStateToProps)(
    connectStyle(ext('VerificationScreen'))(VerificationScreen),
  ),
  true,
);
