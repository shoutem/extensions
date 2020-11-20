import React from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';

import { cloneStatus } from '@shoutem/redux-io';
import { connectStyle } from '@shoutem/theme';
import { GridRow, View } from '@shoutem/ui';

import { currentLocation } from 'shoutem.cms';

import GridEventView from '../components/GridEventView';
import FeaturedEventView from '../components/FeaturedEventView';
import { ext } from '../const';
import { mapDispatchToProps, mapStateToProps, EventsScreen } from './EventsScreen';

export class GridEventsScreen extends EventsScreen {
  static propTypes = {
    ...EventsScreen.propTypes,
  };

  getNavBarProps() {
    return super.getNavBarProps('Grid');
  }

  renderFeaturedItem(event) {
    const { hasFeaturedItem } = this.props;

    return event && hasFeaturedItem ? (
      <FeaturedEventView
        event={event[0]}
        onPress={this.openDetailsScreen}
        action={this.addToCalendar}
      />) : null;
  }

  renderRow(events) {
    const eventsViews = _.map(events, event => (
      <GridEventView
        key={event.id}
        event={event}
        onPress={this.openDetailsScreen}
        action={this.addToCalendar}
      />
    ));

    return (
      <View styleName="flexible">
        <GridRow columns={2}>
          {eventsViews}
        </GridRow>
      </View>
    );
  }

  /**
   * Override CMSListScreen renderData to provide data grouped into rows.
   * @param events
   * @returns {*}
   */
  renderData(events) {
    const { hasFeaturedItem } = this.props;
    const { shouldRenderMap } = this.state;

    if (shouldRenderMap) {
      return this.renderEventsMap(events);
    }

    let isItemFeatured = hasFeaturedItem;
    const groupedEvents = GridRow.groupByRows(events, 2, () => {
      if (isItemFeatured) {
        isItemFeatured = false;
        return 2;
      }
      return 1;
    });

    cloneStatus(events, groupedEvents);

    return super.renderData(groupedEvents);
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(
  connectStyle(ext('GridEventsScreen'))(currentLocation(GridEventsScreen)),
);
