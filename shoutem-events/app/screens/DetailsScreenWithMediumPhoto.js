import React from 'react';
import _ from 'lodash';

import {
  Image,
  View,
  Tile,
} from '@shoutem/ui';
import { connectStyle } from '@shoutem/theme';

import { ext } from '../const';
import { DetailsScreen } from './DetailsScreen';

class DetailsScreenWithMediumPhoto extends DetailsScreen {
  renderWithoutPhoto(event) {
    return (
      <Tile styleName="text-centric lg-gutter-top">
        {this.renderHeadlineDetails(event)}
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
          styleName="large-wide"
          source={{ uri: _.get(event, 'image.url') }}
        />
        <Tile styleName="text-centric">
          {this.renderHeadlineDetails(event)}
        </Tile>
      </View>
    );
  }

  resolveNavBarProps(options = {}) {
    const { event } = this.props;

    return {
      share: {
        title: event.name,
        text: event.description,
        link: event.rsvpLink,
      },
      styleName: _.has(event, 'image.url') ? 'clear' : 'no-border',
      animationName: _.has(event, 'image.url') ? 'solidify' : '',
      ...options,
    };
  }

  renderScreen() {
    const { event } = this.props;

    if (!_.has(event, 'image.url')) {
      // Do not render in full screen, this layout have NavBar
      return super.renderScreen(false);
    }

    return super.renderScreen(true);
  }
}

export default connectStyle(ext(DetailsScreenWithMediumPhoto.name))(DetailsScreenWithMediumPhoto);
