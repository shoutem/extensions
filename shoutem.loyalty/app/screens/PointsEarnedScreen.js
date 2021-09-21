import React, { PureComponent } from 'react';
import autoBindReact from 'auto-bind/react';
import PropTypes from 'prop-types';
import { connectStyle } from '@shoutem/theme';
import { Button, Screen, Subtitle, Text, Title, View } from '@shoutem/ui';
import { I18n } from 'shoutem.i18n';
import { closeModal, getRouteParams } from 'shoutem.navigation';
import { ext } from '../const';

/**
 * Informs the user about his transaction details and how much points he was awarded.
 */
export class PointsEarnedScreen extends PureComponent {
  static propTypes = {
    // Transaction details
    data: PropTypes.shape({
      // Amount spent
      amount: PropTypes.number,
    }),
    // Points earned
    points: PropTypes.number,
  };

  constructor(props) {
    super(props);

    autoBindReact(this);
  }

  componentDidMount() {
    const { navigation } = this.props;

    navigation.setOptions({ ...this.getNavBarProps() });
  }

  // eslint-disable-next-line class-methods-use-this
  getNavBarProps() {
    return {
      headerLeft: () => null,
      title: I18n.t(ext('pointsEarnedNavBarTitle')),
    };
  }

  render() {
    const { data, points } = getRouteParams(this.props);
    const { amount = 0 } = data;

    return (
      <Screen>
        <View styleName="vertical flexible h-center v-center xl-gutter-horizontal">
          <Subtitle styleName="oval-highlight">
            {amount
              ? I18n.t(ext('pointsEarnedAmountSpent'), { amountSpent: amount })
              : ''}
          </Subtitle>
          <Title
            style={{
              fontSize: 45,
              height: 54,
              lineHeight: 54,
            }}
            styleName="lg-gutter-vertical"
          >
            {`+${points}`}
          </Title>
          <Title styleName="h-center">
            {I18n.t(ext('pointsEarnedCongratulations'))}
          </Title>
          <Subtitle styleName="h-center md-gutter">
            {I18n.t(ext('pointsEarnedMessage'), { count: points || 0 })}
          </Subtitle>
          <Button styleName="secondary xl-gutter-vertical" onPress={closeModal}>
            <Text>{I18n.t(ext('confirmButton'))}</Text>
          </Button>
        </View>
      </Screen>
    );
  }
}

export default connectStyle(ext('PointsEarnedScreen'))(PointsEarnedScreen);
