import React from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';
import { currentLocation } from 'shoutem.cms';
import { getRouteParams } from 'shoutem.navigation';
import { cloneStatus } from '@shoutem/redux-io';
import { connectStyle } from '@shoutem/theme';
import { GridRow, View } from '@shoutem/ui';
import FeaturedEventView from '../components/FeaturedEventView';
import GridEventView from '../components/GridEventView';
import { ext } from '../const';
import {
  mapDispatchToProps,
  mapStateToProps,
  EventsScreen,
} from './EventsScreen';

export class GridEventsScreen extends EventsScreen {
  static propTypes = {
    ...EventsScreen.propTypes,
  };

  renderFeaturedItem(event) {
    const { screenSettings } = getRouteParams(this.props);

    return event && screenSettings.hasFeaturedItem ? (
      <FeaturedEventView
        event={event[0]}
        onPress={this.openDetailsScreen}
        action={this.addToCalendar}
      />
    ) : null;
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
        <GridRow columns={2}>{eventsViews}</GridRow>
      </View>
    );
  }

  /**
   * Override CMSListScreen renderData to provide data grouped into rows.
   * @param events
   * @returns {*}
   */
  renderData(events) {
    const {
      screenSettings: { hasFeaturedItem },
    } = getRouteParams(this.props);
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

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(connectStyle(ext('GridEventsScreen'))(currentLocation(GridEventsScreen)));
