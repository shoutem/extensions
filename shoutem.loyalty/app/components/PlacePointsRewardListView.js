import React from 'react';
import PropTypes from 'prop-types';
import { connectStyle } from '@shoutem/theme';
import {
  Caption,
  Divider,
  Image,
  Row,
  Subtitle,
  TouchableOpacity,
  View,
} from '@shoutem/ui';
import { I18n } from 'shoutem.i18n';
import { ext } from '../const';
import PlaceRewardIcon from './PlaceRewardIcon';
import { PlaceRewardListView } from './PlaceRewardListView';
import { placeShape, rewardShape } from './shapes';

export class PlacePointsRewardListView extends PlaceRewardListView {
  static propTypes = {
    available: PropTypes.bool,
    // The place to which this reward belongs
    place: placeShape.isRequired,
    // The reward
    reward: rewardShape.isRequired,
    // Called when reward is pressed
    onPress: PropTypes.func,
  };

  render() {
    const { place, reward } = this.props;
    const { image, pointsRequired, title } = reward;
    const { points } = place;

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
              {I18n.t(ext('pointsRequiredRewards'), {
                count: pointsRequired || 0,
              })}
            </Caption>
          </View>

          <PlaceRewardIcon pointsReached={pointsRequired <= points} />
        </Row>
        <Divider styleName="line" />
      </TouchableOpacity>
    );
  }
}

export default connectStyle(ext('PlacePointsRewardListView'))(
  PlacePointsRewardListView,
);
