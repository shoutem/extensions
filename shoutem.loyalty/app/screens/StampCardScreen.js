import React, { PureComponent } from 'react';
import { Alert } from 'react-native';
import { connect } from 'react-redux';
import autoBindReact from 'auto-bind/react';
import PropTypes from 'prop-types';
import { connectStyle } from '@shoutem/theme';
import { Button, Screen, Text, Title, View } from '@shoutem/ui';
import { I18n } from 'shoutem.i18n';
import { getRouteParams } from 'shoutem.navigation';
import { authorizationShape, rewardShape } from '../components/shapes';
import Stamps from '../components/Stamps';
import { ext } from '../const';
import { collectPoints } from '../services';

/**
 * Lets the cashier stamp a punch card and process the transaction.
 */
export class StampCardScreen extends PureComponent {
  static propTypes = {
    // Stamps the card
    collectPoints: PropTypes.func,
    // An already verified authorization
    authorization: authorizationShape,
    // Reward being stamped
    reward: rewardShape,
  };

  constructor(props) {
    super(props);

    autoBindReact(this);

    this.state = { points: 0 };
  }

  componentDidMount() {
    const { navigation } = this.props;

    navigation.setOptions({
      title: I18n.t(ext('punchCardStampingNavBarTitle')),
    });
  }

  handleDone() {
    const { points } = this.state;

    if (!points) {
      Alert.alert(
        I18n.t(ext('noPointsAwardedErrorTitle')),
        I18n.t(ext('noPointsAwardedErrorMessage')),
      );
      return;
    }

    this.processTransaction();
  }

  processTransaction() {
    const { collectPoints } = this.props;
    const { authorization, reward } = getRouteParams(this.props);
    const { points } = this.state;

    collectPoints({ points }, authorization, reward);
  }

  stampCard(stampIndex) {
    const {
      reward: { points = 0 },
    } = getRouteParams(this.props);

    const addedPoints = stampIndex - points + 1;

    if (addedPoints >= 0) {
      this.setState({ points: addedPoints });
    }
  }

  render() {
    const { reward: originalReward } = getRouteParams(this.props);
    const { points } = this.state;

    const reward = {
      ...originalReward,
      points: (originalReward.points || 0) + points,
    };
    const { title } = reward;

    return (
      <Screen>
        <View styleName="vertical flexible h-center v-center xl-gutter-horizontal">
          <Title styleName="h-center xl-gutter-top md-gutter-bottom">
            {title}
          </Title>
          <Stamps reward={reward} onStamped={this.stampCard} />
          {points >= 0 ? (
            <Button
              styleName="secondary lg-gutter-vertical"
              onPress={this.handleDone}
            >
              <Text>{I18n.t(ext('punchCardStampingDoneButton'))}</Text>
            </Button>
          ) : null}
        </View>
      </Screen>
    );
  }
}

export default connect(undefined, { collectPoints })(
  connectStyle(ext('StampCardScreen'))(StampCardScreen),
);
