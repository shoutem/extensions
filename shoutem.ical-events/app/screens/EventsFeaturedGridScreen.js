import React from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import { connectStyle } from '@shoutem/theme';
import { GridRow, View } from '@shoutem/ui';
import { cloneStatus } from '@shoutem/redux-io';

import { currentLocation } from 'shoutem.cms';

import { ext } from '../extension';
import GridEventView from '../components/GridEventView';
import FeaturedEventView from '../components/FeaturedEventView';
import { mapDispatchToProps, mapStateToProps, EventsListScreen } from './EventsListScreen';

class EventsFeaturedGridScreen extends EventsListScreen {
  static propTypes = {
    ...EventsListScreen.propTypes,
  };

  getNavBarProps() {
    return super.getNavBarProps('Grid');
  }

  renderFeaturedEvent(event) {
    return (
      <FeaturedEventView
        event={event}
        onPress={this.openDetailsScreen}
        action={this.addToCalendar}
      />
    );
  }

  renderRow(events, sectionId, eventId) {
    if (eventId === '0') {
      return this.renderFeaturedEvent(events[0]);
    }

    const eventsViews = _.map(events, event => (
      <GridEventView
        key={event.id}
        event={event}
        onPress={this.openDetailsScreen}
        action={this.addToCalendar}
      />
    ));

    return (
      <View styleName="flexible sm-gutter-bottom">
        <GridRow columns={2}>
          {eventsViews}
        </GridRow>
      </View>
    );
  }

  /**
   * Override EventsListScreen renderData to provide data grouped into rows.
   * @param events
   * @returns {*}
   */
  renderData(events) {
    const { shouldRenderMap } = this.state;

    if (shouldRenderMap) {
      return this.renderEventsMap(events);
    }

    const groupedEvents = GridRow.groupByRows(events, 2, event => (event.featured ? 2 : 1));
    cloneStatus(events, groupedEvents);

    return super.renderData(groupedEvents);
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(
  connectStyle(ext('EventsFeaturedGridScreen'))(currentLocation(EventsFeaturedGridScreen)),
);
