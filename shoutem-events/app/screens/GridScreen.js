import React from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';

import { cloneStatus } from '@shoutem/redux-io';
import { connectStyle } from '@shoutem/theme';
import { GridRow, View } from '@shoutem/ui';

import { currentLocation } from 'shoutem.cms';

import { ext } from '../const';
import GridEventView from '../components/GridEventView';
import { mapDispatchToProps, mapStateToProps, ListScreen } from './ListScreen';

class GridScreen extends ListScreen {
  static propTypes = {
    ...ListScreen.propTypes,
  };

  getNavBarProps() {
    return super.getNavBarProps('Grid');
  }

  renderRow(events) {
    if (events[0].featured) {
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
   * Override CMSListScreen renderData to provide data grouped into rows.
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
  connectStyle(ext('GridScreen'))(currentLocation(GridScreen)),
);
