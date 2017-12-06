import React from 'react';
import { Alert } from 'react-native';
import { connect } from 'react-redux';
import _ from 'lodash';

import {
  Button,
  Screen,
  Subtitle,
  Text,
  TextInput,
  View,
} from '@shoutem/ui';

import { connectStyle } from '@shoutem/theme';
import { NavigationBar } from '@shoutem/ui/navigation';

import { I18n } from 'shoutem.i18n';

import { ext } from '../const';
import {
  rewardShape,
  placeShape,
} from '../components/shapes';
import {
  authorizePointsByPin,
  redeemReward,
} from '../services';
import { verifyPin } from '../redux';

const { bool, func } = React.PropTypes;

const onWrongPin = () => {
  Alert.alert(
  I18n.t(ext('wrongPinErrorTitle')),
  I18n.t(ext('wrongPinErrorMessage')),
    [
      { text: I18n.t('shoutem.application.tryAgainButton') },
    ],
  );
};

/**
 * Lets the cashier enter his PIN before proceeding to stamp a card or redeem a reward.
 * If the user wants to redeem a reward, the transaction is immediately processed.
 * If the cashier wants to stamp a punch card or assign points to a loyalty card,
 * the screen takes him to the next step.
 */
export class PinVerificationScreen extends React.Component {
  static propTypes = {
    // Authorizes assigning points by PIN
    authorizePointsByPin: func,
    //
    place: placeShape,
    // Reward being stamped or redeemed
    reward: rewardShape,
    // True if he user want to redeem a reward, false otherwise
    redeem: bool,
    // Redeems a reward
    redeemReward: func,
    // Verifies the entered PIN
    verifyPin: func,
  };

  constructor(props) {
    super(props);

    this.handleNext = this.handleNext.bind(this);

    this.state = {};
  }

  onPinVerified(pin) {
    const { redeemReward, redeem, reward } = this.props;

    const authorization = { authorizationType: 'pin', data: { pin } };

    // If the user wants to redeem a reward, we do it automatically by substracting the
    // required number of points from his punch or loyalty card
    if (redeem) {
      redeemReward({ points: -reward.pointsRequired }, authorization, reward);
      return;
    }

    this.navigateToNextStep(authorization);
  }

  handleNext() {
    const { verifyPin, place } = this.props;
    const { pin } = this.state;

    const locationId = _.get(place, 'id');

    verifyPin(pin, locationId)
      .then(() => {
        this.onPinVerified(pin);
      })
      .catch(onWrongPin);
  }

  navigateToNextStep(authorization) {
    const { authorizePointsByPin, place, reward } = this.props;

    authorizePointsByPin(authorization, place, reward);
  }

  renderPinComponent() {
    return (
      <TextInput
        autoFocus
        placeholder={I18n.t(ext('pinPlaceholder'))}
        autoCapitalize="none"
        autoCorrect={false}
        keyboardAppearance="light"
        onChangeText={pin => this.setState({ pin })}
        returnKeyType="done"
        secureTextEntry
      />
    );
  }

  render() {
    return (
      <Screen>
        <NavigationBar title={I18n.t(ext('pinVerificationNavBarTitle'))} />
        <View styleName="lg-gutter-top vertical">
          <Subtitle styleName="h-center md-gutter-bottom">{I18n.t(ext('cashierVerificationMessage'))}</Subtitle>
          {this.renderPinComponent()}
          <Button
            styleName="full-width inflexible lg-gutter-vertical"
            onPress={this.handleNext}
          >
            <Text>{I18n.t(ext('rewardRedemptionContinueButton'))}</Text>
          </Button>
        </View>
      </Screen>
    );
  }
}

export default connect(undefined, { authorizePointsByPin, redeemReward, verifyPin })(
  connectStyle(ext('PinVerificationScreen'))(PinVerificationScreen),
);
