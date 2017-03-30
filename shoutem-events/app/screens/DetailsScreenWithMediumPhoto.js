import React from 'react';
import _ from 'lodash';

import {
  Image,
  View,
  Tile,
} from '@shoutem/ui';
import { connectStyle } from '@shoutem/theme';
import { connect } from 'react-redux';

import { ext } from '../const';
import { DetailsScreen, mapDispatchToProps } from './DetailsScreen';

class DetailsScreenWithMediumPhoto extends DetailsScreen {
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

  resolveNavBarProps(options = {}) {
    const { event } = this.props;

    return {
      share: {
        title: event.name,
        link: event.rsvpLink,
      },
      styleName: _.has(event, 'image.url') ? 'clear' : 'no-border',
      animationName: _.has(event, 'image.url') ? 'solidify' : 'boxing',
      title: event.name,
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

export default connect(undefined, mapDispatchToProps)(
  connectStyle(ext('DetailsScreenWithMediumPhoto'))(DetailsScreenWithMediumPhoto),
);
