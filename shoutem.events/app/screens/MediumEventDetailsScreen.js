import React from 'react';
import _ from 'lodash';
import { connectStyle } from '@shoutem/theme';
import { Image, Tile, View } from '@shoutem/ui';
import { ext } from '../const';
import { EventDetailsScreen } from './EventDetailsScreen';

export class MediumEventDetailsScreen extends EventDetailsScreen {
  renderWithoutPhoto(event) {
    return (
      <Tile styleName="text-centric xl-gutter-top">
        {this.renderHeadlineDetails(event)}
        {this.renderAddToCalendarButton()}
      </Tile>
    );
  }

  renderHeader(event) {
    if (!_.has(event, 'image.url')) {
      return this.renderWithoutPhoto(event);
    }

    return (
      <View>
        <Image
          styleName="large-wide placeholder"
          animationName="hero"
          source={{ uri: _.get(event, 'image.url') }}
        />
        <Tile styleName="text-centric inflexible">
          {this.renderHeadlineDetails(event)}
          {this.renderAddToCalendarButton()}
        </Tile>
      </View>
    );
  }
}

export default connectStyle(ext('MediumEventDetailsScreen'))(
  MediumEventDetailsScreen,
);
