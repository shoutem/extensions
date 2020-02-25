import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';

import { connect } from 'react-redux';

import {
  Button,
  Screen,
  View,
  Text,
  Title,
} from '@shoutem/ui';
import { connectStyle } from '@shoutem/theme';

import { I18n } from 'shoutem.i18n';
import { NavigationBar } from 'shoutem.navigation';

import Stamps from '../components/Stamps';
import { collectPoints } from '../services';
import { authorizationShape, rewardShape } from '../components/shapes';
import { ext } from '../const';

const { func } = PropTypes;

/**
 * Lets the cashier stamp a punch card and process the transaction.
 */
export class StampCardScreen extends PureComponent {
  static propTypes = {
    // Stamps the card
    collectPoints: func,
    // An already verified authorization
    authorization: authorizationShape,
    // Reward being stamped
    reward: rewardShape,
  };

  constructor(props) {
    super(props);

    this.handleDone = this.handleDone.bind(this);
    this.stampCard = this.stampCard.bind(this);

    this.state = { points: 0 };
  }

  handleDone() {
    const { points } = this.state;

    if (!points) {
      Alert.alert(
        I18n.t(ext('noPointsAwardedErrorTitle')),
        I18n.t(ext('noPointsAwardedErrorMessage'))
      );
      return;
    }

    this.processTransaction();
  }

  processTransaction() {
    const { collectPoints, authorization, reward } = this.props;
    const { points } = this.state;

    collectPoints({ points }, authorization, reward);
  }

  stampCard(stampIndex) {
    const { reward: { points = 0 } } = this.props;

    const addedPoints = (stampIndex - points) + 1;

    if (addedPoints >= 0) {
      this.setState({ points: addedPoints });
    }
  }

  render() {
    const { reward: originalReward } = this.props;
    const { points } = this.state;

    const reward = { ...originalReward, points: (originalReward.points || 0) + points };
    const { title } = reward;

    return (
      <Screen>
        <NavigationBar title={I18n.t(ext('punchCardStampingNavBarTitle'))} />
        <View styleName="vertical flexible h-center v-center xl-gutter-horizontal">
          <Title styleName="h-center xl-gutter-top md-gutter-bottom">{title}</Title>
          <Stamps
            reward={reward}
            onStamped={this.stampCard}
          />
          { points >= 0 ?
            <Button
              styleName="secondary lg-gutter-vertical"
              onPress={this.handleDone}
            >
              <Text>{I18n.t(ext('punchCardStampingDoneButton'))}</Text>
            </Button>
            :
            null
          }
        </View>
      </Screen>
    );
  }
}

export default connect(undefined, { collectPoints })(
  connectStyle(ext('StampCardScreen'))(StampCardScreen),
);
