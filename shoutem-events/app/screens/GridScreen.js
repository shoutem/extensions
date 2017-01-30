import React from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';

import { cloneStatus } from '@shoutem/redux-io';
import { connectStyle } from '@shoutem/theme';
import { GridRow, View } from '@shoutem/ui';

import { ext } from '../const';
import GridEventView from '../components/GridEventView';
import { mapDispatchToProps, mapStateToProps, ListScreen } from './ListScreen';

class GridScreen extends ListScreen {
  static propTypes = {
    ...ListScreen.propTypes,
  };

  renderRow(events) {
    if (events[0].featured) {
      return this.renderFeaturedEvent(events[0]);
    }

    const eventsViews = _.map(events, (article) => (
      <GridEventView
        key={article.id}
        event={article}
        onPress={this.openDetailsScreen}
        action={this.addToCalendar}
      />
    ));
    return (
      <View styleName="sm-gutter-bottom">
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
    const groupedEvents = GridRow.groupByRows(events, 2, (event) => (event.featured ? 2 : 1));

    cloneStatus(events, groupedEvents);

    if (this.state.mapMode) {
      const selectedMapEvent = this.state.selectedMapEvent;

      return (
        <View styleName="flexible">
          {this.renderEventsMap(events)}
          {selectedMapEvent ? this.renderEventListItem(selectedMapEvent) : null}
        </View>
      );
    }

    return super.renderData(groupedEvents);
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(
  connectStyle(ext(GridScreen.name))(GridScreen)
);
