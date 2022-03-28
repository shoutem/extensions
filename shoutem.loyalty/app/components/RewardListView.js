import React, { PureComponent } from 'react';
import autoBindReact from 'auto-bind/react';
import PropTypes from 'prop-types';
import { connectStyle } from '@shoutem/theme';
import {
  Divider,
  Image,
  Row,
  Subtitle,
  TouchableOpacity,
  View,
} from '@shoutem/ui';
import { I18n } from 'shoutem.i18n';
import { assets } from 'shoutem.layouts';
import { ext } from '../const';
import { rewardShape } from './shapes';

const { func } = PropTypes;

/**
 * Renders a single reward, in a list of rewards for places.
 */
export class RewardListView extends PureComponent {
  constructor(props) {
    super(props);

    autoBindReact(this);
  }

  onPress() {
    const { onPress, reward } = this.props;

    onPress(reward);
  }

  render() {
    const { reward } = this.props;
    const { id, image, pointsRequired, title } = reward;

    const rewardImage = image ? { uri: image.url } : assets.noImagePlaceholder;

    return (
      <TouchableOpacity key={id} onPress={this.onPress}>
        <Row>
          <Image styleName="small placeholder" source={rewardImage} />
          <View styleName="vertical stretch space-between">
            <Subtitle>{title}</Subtitle>
            <Subtitle>
              {I18n.t(ext('pointsRequiredRewards'), {
                count: pointsRequired || 0,
              })}
            </Subtitle>
          </View>
        </Row>
        <Divider styleName="line" />
      </TouchableOpacity>
    );
  }
}

RewardListView.propTypes = {
  // The reward
  reward: rewardShape.isRequired,
  // Called when reward is pressed
  onPress: func.isRequired,
};

export default connectStyle(ext('RewardListView'))(RewardListView);
