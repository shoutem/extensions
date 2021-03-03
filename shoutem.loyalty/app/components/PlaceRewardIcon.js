import React, { PureComponent } from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { connectStyle } from '@shoutem/theme';
import { Icon, View } from '@shoutem/ui';
import { ext } from '../const';

export class PlaceRewardIcon extends PureComponent {
  static propTypes = {
    pointsReached: PropTypes.bool,
    style: PropTypes.object,
  };

  render() {
    const { pointsReached, style } = this.props;
    const externalStyle = _.omit(style, ['reward', 'rewardReached']);

    return (
      <View
        style={{
          ...style.reward,
          ...(pointsReached ? style.rewardReached : {}),
          ...externalStyle,
        }}
      >
        <Icon name="gift" />
      </View>
    );
  }
}

export default connectStyle(ext('PlaceRewardIcon'), {})(PlaceRewardIcon);
