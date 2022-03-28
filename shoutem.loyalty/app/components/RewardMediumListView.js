import React, { PureComponent } from 'react';
import autoBindReact from 'auto-bind/react';
import PropTypes from 'prop-types';
import { connectStyle } from '@shoutem/theme';
import {
  Caption,
  Image,
  Tile,
  Title,
  TouchableOpacity,
  View,
} from '@shoutem/ui';
import { I18n } from 'shoutem.i18n';
import { assets } from 'shoutem.layouts';
import { ext } from '../const';
import RewardProgressBar from './RewardProgressBar';
import { rewardShape } from './shapes';

const { func } = PropTypes;

/**
 * Renders a single reward, in a list of rewards for places.
 */
export class RewardMediumListView extends PureComponent {
  static propTypes = {
    // The reward
    reward: rewardShape.isRequired,
    // Called when reward is pressed
    onPress: func,
  };

  constructor(props) {
    super(props);

    autoBindReact(this);
  }

  onPress() {
    this.props.onPress(this.props.reward);
  }

  render() {
    const { reward, points } = this.props;
    const { id, image, pointsRequired, title } = reward;

    const rewardImage = image ? { uri: image.url } : assets.noImagePlaceholder;

    return (
      <TouchableOpacity key={id} onPress={this.onPress}>
        <Tile>
          <Image styleName="large-banner" source={rewardImage} />
          <RewardProgressBar
            pointsRequired={pointsRequired}
            points={points}
            styleName="short"
          />
          <View styleName="content">
            <Title>{title}</Title>
            <View styleName="horizontal space-between">
              <Caption>
                {I18n.t(ext('pointsRequiredRewards'), {
                  count: pointsRequired || 0,
                })}
              </Caption>
            </View>
          </View>
        </Tile>
      </TouchableOpacity>
    );
  }
}

export default connectStyle(ext('RewardMediumListView'))(RewardMediumListView);
