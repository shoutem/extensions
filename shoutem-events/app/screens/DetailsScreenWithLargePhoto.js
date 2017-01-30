import React from 'react';
import _ from 'lodash';
import { connectStyle } from '@shoutem/theme';
import { Tile } from '@shoutem/ui';

import EventImage from '../components/EventImage';
import { ext } from '../const';
import { DetailsScreen } from './DetailsScreen';

class DetailsScreenWithLargePhoto extends DetailsScreen {
  getTileStyle(event) {
    if (!_.has(event, 'image.url')) {
      return {
        style: {
          backgroundColor: '#2c2c2c',
        },
      };
    }
    return null;
  }

  renderHeader(event) {
    return (
      <EventImage animationName="hero" styleName="large-portrait" event={event}>
        <Tile
          animationName="hero"
          styleName="text-centric"
          {...this.getTileStyle(event)}
        >
          {this.renderHeadlineDetails(event, false)}
        </Tile>
      </EventImage>
    );
  }
}

export default connectStyle(ext(DetailsScreenWithLargePhoto.name))(DetailsScreenWithLargePhoto);
