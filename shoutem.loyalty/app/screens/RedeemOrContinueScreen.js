import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import autoBindReact from 'auto-bind/react';
import PropTypes from 'prop-types';
import { connectStyle } from '@shoutem/theme';
import { Button, Image, Screen, Subtitle, Text, View } from '@shoutem/ui';
import { I18n } from 'shoutem.i18n';
import { getRouteParams, navigateTo } from 'shoutem.navigation';
import { authorizationShape, rewardShape } from '../components/shapes';
import { ext } from '../const';
import { redeemReward } from '../services';

const STAMP_ICON = require('../assets/icons/stamp.png');

/**
 * Lets the user choose if he wants to redeem his reward immediately or not.
 * This screen is shown when the user was awarded enough points on his punch card
 * to be able to redeem a reward.
 */
export class RedeemOrContinueScreen extends PureComponent {
  static propTypes = {
    // An already verified authorization,
    authorization: authorizationShape,
    // Points assigned in transaction
    points: PropTypes.number,
    // Reward that can be redeemed
    reward: rewardShape,
    // Redeems the reward
    redeemReward: PropTypes.func,
  };

  constructor(props) {
    super(props);

    autoBindReact(this);
  }

  componentDidMount() {
    const { navigation } = this.props;

    navigation.setOptions({ title: I18n.t(ext('redeemRewardNavBarTitle')) });
  }

  handleRedeemLater() {
    const { points } = getRouteParams(this.props);

    navigateTo(ext('TransactionProcessedScreen'), {
      points,
    });
  }

  handleRedeemNow() {
    const { reward } = getRouteParams(this.props);
    const { pointsRequired } = reward;

    this.processTransaction(-pointsRequired);
  }

  processTransaction(points) {
    const { redeemReward } = this.props;
    const { authorization, reward } = getRouteParams(this.props);

    redeemReward({ points }, authorization, reward);
  }

  render() {
    return (
      <Screen>
        <View styleName="vertical flexible h-center v-center xl-gutter-horizontal">
          <View styleName="oval-highlight">
            <Image source={STAMP_ICON} styleName="small-avatar" />
          </View>
          <Subtitle styleName="h-center md-gutter-top xl-gutter-horizontal">
            {I18n.t(ext('redeemMessage'))}
          </Subtitle>
          <View styleName="h-center horizontal lg-gutter-vertical">
            <Button onPress={this.handleRedeemLater}>
              <Text>{I18n.t(ext('redeemLaterButton'))}</Text>
            </Button>
            <Button
              styleName="secondary md-gutter-left"
              onPress={this.handleRedeemNow}
            >
              <Text>{I18n.t(ext('redeemNowButton'))}</Text>
            </Button>
          </View>
        </View>
      </Screen>
    );
  }
}

export default connect(undefined, { redeemReward })(
  connectStyle(ext('RedeemOrContinueScreen'))(RedeemOrContinueScreen),
);
