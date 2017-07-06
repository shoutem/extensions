import React from 'react';

import { connect } from 'react-redux';

import {
  Button,
  Screen,
  View,
  Text,
  Title,
} from '@shoutem/ui';

import { navigateTo } from '@shoutem/core/navigation';
import { connectStyle } from '@shoutem/theme';
import { NavigationBar } from '@shoutem/ui/navigation';

import {
  ext,
} from '../const';

import { reward as rewardShape } from '../components/shapes';
import Stamps from '../components/Stamps';

import { createTransaction } from '../redux';

const { func, string } = React.PropTypes;

/**
 * Lets the cashier stamp a punch card and process the transaction.
 * If there is enough points on the card, the customer can redeem it.
 */
export class StampCardScreen extends React.Component {
  static propTypes = {
    // Stamps the card
    createTransaction: func,
    // If the user can redeem a reward, used to take him to the redeem or continue screen
    navigateTo: func,
    // An already verified PIN
    pin: string,
    // Reward being stamped
    reward: rewardShape,
  };

  constructor(props) {
    super(props);

    this.onDone = this.onDone.bind(this);

    this.state = { points: 0 };
  }

  onDone() {
    this.processTransaction();
  }

  processTransaction() {
    const { createTransaction, pin, reward } = this.props;
    const { points } = this.state;

    createTransaction({ points }, pin, reward);
  }

  stampCard(stampIndex) {
    const { reward: { points = 0 } } = this.props;

    const addedPoints = (stampIndex - points) + 1;

    if (addedPoints >= 0) {
      this.setState({ points: addedPoints });
    }
  }

  render() {
    const { reward: original } = this.props;
    const { points } = this.state;

    const reward = { ...original, points: (original.points || 0) + points };
    const { title } = reward;

    return (
      <Screen>
        <NavigationBar title="STAMP CARD" />
        <View styleName="vertical flexible h-center v-center xl-gutter-horizontal">
          <Title styleName="h-center xl-gutter-top md-gutter-bottom">{title}</Title>
          <Stamps
            reward={reward}
            onStamped={stampIndex => this.stampCard(stampIndex)}
          />
          { points >= 0 ?
            <Button
              styleName="secondary lg-gutter-vertical"
              onPress={this.onDone}
            >
              <Text>DONE</Text>
            </Button>
            :
            null
          }
        </View>
      </Screen>
    );
  }
}

export default connect(undefined, { createTransaction, navigateTo })(
  connectStyle(ext('StampCardScreen'))(StampCardScreen),
);
