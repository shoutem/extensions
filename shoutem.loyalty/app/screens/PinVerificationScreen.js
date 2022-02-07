import React, { PureComponent } from 'react';
import { Alert, Keyboard } from 'react-native';
import { connect } from 'react-redux';
import autoBindReact from 'auto-bind/react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { connectStyle } from '@shoutem/theme';
import { Button, Screen, Subtitle, Text, TextInput, View } from '@shoutem/ui';
import { I18n } from 'shoutem.i18n';
import { getRouteParams } from 'shoutem.navigation';
import { placeShape, rewardShape } from '../components/shapes';
import { ext } from '../const';
import { verifyPin } from '../redux';
import { authorizePointsByPin, redeemReward } from '../services';

const onWrongPin = () => {
  Alert.alert(
    I18n.t(ext('wrongPinErrorTitle')),
    I18n.t(ext('wrongPinErrorMessage')),
    [{ text: I18n.t('shoutem.application.tryAgainButton') }],
  );
};

/**
 * Lets the cashier enter his PIN before proceeding to stamp a card or redeem a reward.
 * If the user wants to redeem a reward, the transaction is immediately processed.
 * If the cashier wants to stamp a punch card or assign points to a loyalty card,
 * the screen takes him to the next step.
 */
export class PinVerificationScreen extends PureComponent {
  static propTypes = {
    //
    place: placeShape,
    // Reward being stamped or redeemed
    reward: rewardShape,
    // True if he user want to redeem a reward, false otherwise
    redeem: PropTypes.bool,
    // Redeems a reward
    redeemReward: PropTypes.func,
    // Verifies the entered PIN
    verifyPin: PropTypes.func,
  };

  constructor(props) {
    super(props);

    autoBindReact(this);

    this.state = {};
  }

  componentDidMount() {
    const { navigation } = this.props;

    navigation.setOptions({ title: I18n.t(ext('pinVerificationNavBarTitle')) });
  }

  onPinVerified(pin) {
    const { redeemReward } = this.props;
    const { redeem, reward } = getRouteParams(this.props);

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
    const { verifyPin } = this.props;
    const { pin } = this.state;
    const { place } = getRouteParams(this.props);

    const locationId = _.get(place, 'id');

    // Weird Android behavior requires this kind of dismissal
    Keyboard.dismiss();

    verifyPin(pin, locationId)
      .then(() => {
        this.onPinVerified(pin);
      })
      .catch(onWrongPin);
  }

  navigateToNextStep(authorization) {
    const { place, reward } = getRouteParams(this.props);

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
        <View styleName="lg-gutter-top vertical">
          <Subtitle styleName="h-center md-gutter-bottom">
            {I18n.t(ext('cashierVerificationMessage'))}
          </Subtitle>
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

export default connect(undefined, {
  redeemReward,
  verifyPin,
})(connectStyle(ext('PinVerificationScreen'))(PinVerificationScreen));
