import React from 'react';

import { Alert } from 'react-native';

import { connect } from 'react-redux';

import { navigateTo } from '@shoutem/core/navigation';

import {
  Button,
  Screen,
  Subtitle,
  Text,
  TextInput,
  View,
} from '@shoutem/ui';

import {
  invalidate,
} from '@shoutem/redux-io';


import { connectStyle } from '@shoutem/theme';
import { NavigationBar } from '@shoutem/ui/navigation';

import {
  ext,
} from '../const';

import { reward as rewardShape } from '../components/shapes';

import {
  createTransaction,
  verifyPin,
} from '../redux';

const { bool, func } = React.PropTypes;

const onWrongPin = () => {
  Alert.alert(
  'Wrong pin',
  'The PIN you entered was incorrect.',
    [
      { text: 'Try again' },
    ],
  );
};

/**
 * Lets the cashier enter his PIN before proceeding to stamp a card or redeem a reward.
 * If the user wants to redeem a reward, the transaction is immediately processed.
 * If the cashier wants to stamp a punch card or assign points to a loyalty card,
 * the screen takes him to the next step.
 */
export class VerificationScreen extends React.Component {
  static propTypes = {
    // Reward being stamped or redeemed
    reward: rewardShape,
    // True if he user want to redeem a reward, false otherwise
    redeem: bool,
    // Creates a transaction for redeeming a reward
    createTransaction: func,
    // Used to navigate to the next step
    navigateTo: func,
    // Verifies the entered PIN
    verifyPin: func,
  };

  constructor(props) {
    super(props);

    this.onNext = this.onNext.bind(this);

    this.state = {};
  }

  onNext() {
    const { verifyPin } = this.props;
    const { pin } = this.state;

    verifyPin(pin)
    .then(() => {
      this.onPinVerified(pin);
    })
    .catch(onWrongPin);
  }

  onPinVerified(pin) {
    const { createTransaction, redeem, reward } = this.props;

    // If the user wants to redeem a reward, we do it automatically by substracting the
    // required number of points from his punch or loyalty card
    if (redeem) {
      createTransaction({ points: -reward.pointsRequired }, pin, reward);
      return;
    }

    this.navigateToNextStep(pin);
  }

  navigateToNextStep(pin) {
    const { navigateTo, reward } = this.props;

    navigateTo({
      screen: ext(`${reward ? 'StampCardScreen' : 'AssignPointsScreen'}`),
      props: {
        pin,
        reward,
      },
    });
  }

  renderPinComponent() {
    return (
      <TextInput
        placeholder="Enter your PIN"
        autoCapitalize="none"
        autoCorrect={false}
        keyboardType="numeric"
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
        <NavigationBar title="CASHIER PIN" />
        <View styleName="vertical flexible h-center lg-gutter-top">
          <Subtitle styleName="h-center md-gutter-bottom">Show this screen to cashier</Subtitle>
          {this.renderPinComponent()}
          <Button
            styleName="secondary lg-gutter-vertical"
            onPress={this.onNext}
          >
            <Text>NEXT</Text>
          </Button>
        </View>
      </Screen>
    );
  }
}

export default connect(undefined, { createTransaction, invalidate, verifyPin, navigateTo })(
  connectStyle(ext('VerificationScreen'))(VerificationScreen),
);
