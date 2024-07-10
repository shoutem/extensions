import React from 'react';
import { connectStyle } from '@shoutem/theme';
import { Tile } from '@shoutem/ui';
import EventImage from '../components/EventImage';
import { ext } from '../const';
import { EventDetailsScreen } from './EventDetailsScreen';

export class LargeEventDetailsScreen extends EventDetailsScreen {
  renderHeader(event) {
    return (
      <EventImage
        animationName="hero"
        styleName="large-portrait"
        event={event}
        isListItemImage={false}
      >
        <Tile animationName="hero" styleName="text-centric">
          {this.renderHeadlineDetails(event, false)}
          {this.renderAddToCalendarButton(false)}
        </Tile>
      </EventImage>
    );
  }
}

export default connectStyle(ext('LargeEventDetailsScreen'))(
  LargeEventDetailsScreen,
);
