import React from 'react';
import { connectStyle } from '@shoutem/theme';
import { Tile, ImageBackground } from '@shoutem/ui';
import { connect } from 'react-redux';

import { ext } from '../extension';
import { BaseEventDetailsScreen } from './BaseEventDetailsScreen';
import { openURL as openUrlAction } from 'shoutem.web-view';
import { navigateTo as navigateToAction } from '@shoutem/core/navigation';

export class EventDetailsScreen extends BaseEventDetailsScreen {
  renderHeader(event) {
    return (
      <Tile
        animationName="hero"
        styleName="text-centric"
      >
        {this.renderHeadlineDetails(event, true, true)}
        {this.renderAddToCalendarButton(false)}
      </Tile>
    );
  }
}

export const mapDispatchToProps = {
  openURL: openUrlAction,
  navigateTo: navigateToAction,
};

export default connect(undefined, mapDispatchToProps)(
  connectStyle(ext('EventDetailsScreen'))(EventDetailsScreen),
);
