import React from 'react';

import { connect } from 'react-redux';

import {
  Button,
  Icon,
  Screen,
  Subtitle,
  Text,
  View,
} from '@shoutem/ui';

import { navigateTo } from '@shoutem/core/navigation';
import { connectStyle } from '@shoutem/theme';
import { NavigationBar } from '@shoutem/ui/navigation';

import { ext } from '../const';
import { createTransaction } from '../redux';
import { reward as rewardShape } from '../components/shapes';

const { func, number, string } = React.PropTypes;

/**
 * Lets the user choose if he wants to redeem his reward immediately or not.
 * This screen is shown when the user was awarded enough points on his punch card
 * to be able to redeem a reward.
 */
export class RedeemOrContinueScreen extends React.Component {
  static propTypes = {
    navigateTo: func,
    // An already verified PIN
    pin: string,
    // Points assigned in transaction
    points: number,
    // Reward that can be redeemed
    reward: rewardShape,
    // Creates a transaction to redeem a reward
    createTransaction: func,
  };

  constructor(props) {
    super(props);

    this.onRedeemLater = this.onRedeemLater.bind(this);
    this.onRedeemNow = this.onRedeemNow.bind(this);
  }

  onRedeemLater() {
    const { navigateTo, points } = this.props;

    navigateTo({
      screen: ext('TransactionProcessedScreen'),
      props: {
        points,
      },
    });
  }

  onRedeemNow() {
    const { pointsRequired } = this.props.reward;

    this.processTransaction(-pointsRequired);
  }

  processTransaction(points) {
    const { createTransaction, pin, reward } = this.props;

    createTransaction({ points }, pin, reward);
  }

  render() {
    return (
      <Screen>
        <NavigationBar title="REDEEM REWARD" />
        <View styleName="vertical flexible h-center v-center xl-gutter-horizontal">
          <View styleName="oval-highlight">
            <Icon name="stamp" />
          </View>
          <Subtitle styleName="h-center md-gutter-top xl-gutter-horizontal">
            Your reward can be redeemed.
          </Subtitle>
          <View styleName="h-center horizontal lg-gutter-vertical">
            <Button onPress={this.onRedeemLater}>
              <Text>REDEEM LATER</Text>
            </Button>
            <Button
              styleName="secondary md-gutter-left"
              onPress={this.onRedeemNow}
            >
              <Text>REDEEM NOW</Text>
            </Button>
          </View>

        </View>
      </Screen>
    );
  }
}

export default connect(undefined, { createTransaction, navigateTo })(
  connectStyle(ext('RedeemOrContinueScreen'))(RedeemOrContinueScreen),
);
