import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connectStyle } from '@shoutem/theme';
import { View } from '@shoutem/ui';
import { ext } from '../const';

const { number } = PropTypes;

/**
 * Shows progress towards a reward
 */
class RewardProgressBar extends PureComponent {
  static propTypes = {
    // Number of points
    points: number,
    // Points needed to redeem a reward
    pointsRequired: number,
  };

  render() {
    const { points, pointsRequired, style } = this.props;
    const progressPercentage = 100 * (points / pointsRequired);

    return (
      <View styleName="horizontal flexible" style={style.container}>
        <View
          style={{
            ...style.earnedPoints,
            flex: progressPercentage,
          }}
        />
        <View
          style={{
            flex: 100 - progressPercentage,
          }}
        />
      </View>
    );
  }
}

export default connectStyle(ext('RewardProgressBar'))(RewardProgressBar);
