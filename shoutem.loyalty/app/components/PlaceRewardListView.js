import React, { PureComponent } from 'react';
import autoBindReact from 'auto-bind/react';
import PropTypes from 'prop-types';
import { connectStyle } from '@shoutem/theme';
import {
  Caption,
  Divider,
  Icon,
  Image,
  Row,
  Subtitle,
  TouchableOpacity,
  View,
} from '@shoutem/ui';
import { I18n } from 'shoutem.i18n';
import { ext } from '../const';
import RewardProgressBar from './RewardProgressBar';
import { placeShape, rewardShape } from './shapes';

/**
 * Renders a single reward, in a list of rewards for places.
 */
export class PlaceRewardListView extends PureComponent {
  static propTypes = {
    // The place to which this reward belongs
    place: placeShape.isRequired,
    // The reward
    reward: rewardShape.isRequired,
    // Called when reward is pressed
    onPress: PropTypes.func,
  };

  constructor(props) {
    super(props);

    autoBindReact(this);
  }

  onPress() {
    this.props.onPress(this.props.reward);
  }

  render() {
    const {
      place: { points },
      reward,
    } = this.props;
    const { image, pointsRequired, title } = reward;

    return (
      <TouchableOpacity onPress={this.onPress}>
        <Row>
          <Image
            styleName="small rounded-corners placeholder"
            source={image ? { uri: image.url } : ''}
          />
          <View styleName="vertical stretch space-between">
            <Subtitle numberOfLines={2}>{title}</Subtitle>
            <Caption>
              {I18n.t(ext('pointsRequiredStores'), {
                count: pointsRequired || 0,
              })}
            </Caption>
          </View>
          <Icon styleName="disclosure" name="right-arrow" />
        </Row>
        <Row>
          <RewardProgressBar points={points} pointsRequired={pointsRequired} />
        </Row>
        <Divider styleName="line" />
      </TouchableOpacity>
    );
  }
}

export default connectStyle(ext('PlaceRewardListView'))(PlaceRewardListView);
