import React, { PureComponent } from 'react';
import autoBindReact from 'auto-bind/react';
import PropTypes from 'prop-types';
import { connectStyle } from '@shoutem/theme';
import { Button, Image, Screen, Subtitle, Text, View } from '@shoutem/ui';
import { I18n } from 'shoutem.i18n';
import { closeModal, getRouteParams } from 'shoutem.navigation';
import { ext } from '../const';

const STAMP_ICON = require('../assets/icons/stamp.png');
const TROPHY_ICON = require('../assets/icons/trophy.png');

const getNavBarProps = () => ({
  headerLeft: () => null,
  title: I18n.t(ext('rewardRedemptionCongratulation')),
});

/**
 * Informs the user about a successfully processed transaction.
 * Tells him how much points he received on his punch card or if he redeemed a reward.
 */
export class TransactionProcessedScreen extends PureComponent {
  static propTypes = {
    // Points assigned in transaction
    points: PropTypes.number,
    // Whether the transaction redeemed a reward
    redeemed: PropTypes.bool,
  };

  constructor(props) {
    super(props);

    autoBindReact(this);
  }

  componentDidMount() {
    const { navigation } = this.props;

    navigation.setOptions({
      ...getNavBarProps(),
    });
  }

  render() {
    const { points, redeemed } = getRouteParams(this.props);

    const message = redeemed
      ? I18n.t(ext('rewardRedemptionMessage'))
      : I18n.t(ext('punchCardStampedMessage'), { count: points || 0 });

    return (
      <Screen>
        <View styleName="vertical flexible h-center v-center xl-gutter-horizontal">
          <View styleName="oval-highlight">
            <Image
              source={redeemed ? TROPHY_ICON : STAMP_ICON}
              styleName="small-avatar"
            />
          </View>
          <Subtitle styleName="h-center md-gutter-top xl-gutter-horizontal">
            {message}
          </Subtitle>
          <Button styleName="secondary lg-gutter-vertical" onPress={closeModal}>
            <Text>{I18n.t(ext('rewardRedemptionContinueButton'))}</Text>
          </Button>
        </View>
      </Screen>
    );
  }
}

export default connectStyle(ext('TransactionProcessedScreen'))(
  TransactionProcessedScreen,
);
