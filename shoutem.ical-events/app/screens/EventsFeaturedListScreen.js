import React from 'react';
import { connect } from 'react-redux';
import { connectStyle } from '@shoutem/theme';

import { currentLocation } from 'shoutem.cms';

import { addToCalendar } from '../services/Calendar';
import ListEventView from '../components/ListEventView';
import FeaturedEventView from '../components/FeaturedEventView';
import { ext } from '../extension';
import { mapDispatchToProps, mapStateToProps, EventsListScreen } from './EventsListScreen';

export class EventsFeaturedListScreen extends EventsListScreen {
  static propTypes = {
    ...EventsListScreen.propTypes,
  };

  renderFeaturedEvent(event) {
    return (
      <FeaturedEventView
        event={event}
        onPress={this.openDetailsScreen}
        action={this.addToCalendar}
      />
    );
  }

  renderEventListItem(event, style = {}) {
    return (
      <ListEventView
        event={event}
        onPress={this.openDetailsScreen}
        action={this.addToCalendar}
        style={style}
      />
    );
  }

  renderRow(event, sectionId, eventId) {
    if (eventId === '0') {
      return this.renderFeaturedEvent(event);
    }

    return this.renderEventListItem(event);
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(
  connectStyle(ext('EventsFeaturedListScreen'))(currentLocation(EventsFeaturedListScreen)),
);
