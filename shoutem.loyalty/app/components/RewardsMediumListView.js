import PropTypes from 'prop-types';
import React, { Component } from 'react';

import {
  TouchableOpacity,
  Image,
  Tile,
  Title,
  Caption,
  View,
} from '@shoutem/ui';

import { connectStyle } from '@shoutem/theme';

import { I18n } from 'shoutem.i18n';

import { ext } from '../const';
import RewardProgressBar from './RewardProgressBar';

import {
  rewardShape,
} from './shapes';

const { func } = PropTypes;

/**
 * Renders a single reward, in a list of rewards for places.
 */
export class RewardMediumListView extends Component {
  static propTypes = {
    // The reward
    reward: rewardShape.isRequired,
    // Called when reward is pressed
    onPress: func,
  };

  constructor(props) {
    super(props);
    this.onPress = this.onPress.bind(this);
  }

  onPress() {
    this.props.onPress(this.props.reward);
  }

  render() {
    const { reward, points } = this.props;
    const { id, image, pointsRequired, title } = reward;

    return (
      <TouchableOpacity
        key={id}
        onPress={this.onPress}
      >
        <Tile>
          <Image
            styleName="large-banner"
            source={{ uri: image ? image.url : '' }}
          />
          <RewardProgressBar
            pointsRequired={pointsRequired}
            points={points}
            styleName="short"
          />
          <View styleName="content">
            <Title>{title}</Title>
            <View styleName="horizontal space-between">
              <Caption>{`${pointsRequired}${I18n.t(ext('pointsRequiredRewards'))}`}</Caption>
            </View>
          </View>
        </Tile>
      </TouchableOpacity>
    );
  }
}

export default connectStyle(ext('RewardMediumListView'))(RewardMediumListView);
