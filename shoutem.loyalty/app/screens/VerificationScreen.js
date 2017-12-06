import React from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';
import QRCode from 'react-native-qrcode';

import { navigateTo } from '@shoutem/core/navigation';

import {
  Button,
  Screen,
  Subtitle,
  Text,
  View,
} from '@shoutem/ui';

import { connectStyle } from '@shoutem/theme';
import { NavigationBar } from '@shoutem/ui/navigation';

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

const { bool, func, string } = React.PropTypes;

/**
 * Encodes reward values in an array to save space in QR code.
 */
const getEncodedRewardValues = (reward) => {
  const { id, location = '', parentCategoryId, points, pointsRequired, title } = reward;

  return [id, location, isPunchCard(reward), parentCategoryId, points, pointsRequired, title];
};

/**
 * Shows points card details for a single card loyalty program
 */
export class VerificationScreen extends React.Component {
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
    const { cardId, reward, redeem, place } = this.props;

    const rewardData = reward ? getEncodedRewardValues(reward) : '';
    const placeId = _.get(place, 'id');

    const transactionData = [cardId, placeId, rewardData, redeem];

    return (
      <Screen>
        <NavigationBar />
        <View styleName="sm-gutter flexible vertical h-center v-center">
          <Subtitle styleName="xl-gutter-bottom">{I18n.t(ext('cashierVerificationMessage'))}</Subtitle>
          <QRCode
            size={160}
            value={JSON.stringify(transactionData)}
          />
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
