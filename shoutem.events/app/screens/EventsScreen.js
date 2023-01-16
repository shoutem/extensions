import React from 'react';
import { connect } from 'react-redux';
import autoBindReact from 'auto-bind/react';
import _ from 'lodash';
import { isInitialized } from '@shoutem/redux-io';
import { connectStyle } from '@shoutem/theme';
import { Button, Text } from '@shoutem/ui';
import { triggerEvent } from 'shoutem.analytics';
import { CmsListScreen, currentLocation } from 'shoutem.cms';
import { I18n } from 'shoutem.i18n';
import { getRouteParams, navigateTo } from 'shoutem.navigation';
import EventsMap from '../components/EventsMap';
import FeaturedEventView from '../components/FeaturedEventView';
import { createListItem } from '../components/ListItemViewFactory';
import { EVENTS_SCHEME, EVENTS_TAG, ext } from '../const';
import { addToCalendar } from '../shared/Calendar';

export class EventsScreen extends CmsListScreen {
  static propTypes = {
    ...CmsListScreen.propTypes,
  };

  constructor(props, context) {
    super(props, context);

    autoBindReact(this);

    this.state = {
      ...this.state,
      schema: EVENTS_SCHEME,
      shouldRenderMap: false,
    };

    this.navBarViewTitle = {
      map: I18n.t('shoutem.cms.navBarMapViewButton'),
      list: I18n.t('shoutem.cms.navBarListViewButton'),
    };
  }

  fetchData(options) {
    const { find } = this.props;
    const { schema } = this.state;

    find(schema, undefined, {
      query: this.getQueryParams(options),
    });
  }

  getQueryParams(options) {
    const queryParams = super.getQueryParams(options);

    return {
      ...queryParams,
      'filter[endTime][gt]': new Date().toISOString(), // filtering past events
    };
  }

  openDetailsScreen(event) {
    return navigateTo(ext('EventDetailsScreen'), {
      title: event.name,
      event,
      analyticsPayload: {
        itemId: event.id,
        itemName: event.name,
      },
    });
  }

  addToCalendar(event) {
    const { triggerEvent } = this.props;

    addToCalendar(event);
    triggerEvent('Event', 'Add to calendar', { label: event.name });
  }

  toggleMapMode() {
    const { shouldRenderMap } = this.state;

    this.setState({ shouldRenderMap: !shouldRenderMap });
  }

  getNavBarProps() {
    return {
      ...super.getNavBarProps(),
      headerRight: this.headerRight,
    };
  }

  headerRight(props) {
    const { data } = this.props;
    const { shouldRenderMap } = this.state;

    if (_.isEmpty(data) || !isInitialized(data)) {
      return null;
    }

    return (
      <Button styleName="clear" onPress={this.toggleMapMode}>
        <Text style={props.tintColor}>
          {shouldRenderMap
            ? this.navBarViewTitle.list
            : this.navBarViewTitle.map}
        </Text>
      </Button>
    );
  }

  renderFeaturedItem(item) {
    const { screenSettings } = getRouteParams(this.props);

    return screenSettings.hasFeaturedItem ? (
      <FeaturedEventView
        event={item}
        onPress={this.openDetailsScreen}
        action={this.addToCalendar}
      />
    ) : null;
  }

  renderEventListItem(event, style = {}) {
    const { screenSettings } = getRouteParams(this.props);

    return createListItem(
      screenSettings.listType,
      event,
      this.openDetailsScreen,
      this.addToCalendar,
      style,
    );
  }

  renderRow(event) {
    return this.renderEventListItem(event);
  }

  renderEventsMap(data) {
    const { style } = this.props;

    return (
      <EventsMap
        data={data}
        style={style}
        addToCalendar={this.addToCalendar}
        openDetailsScreen={this.openDetailsScreen}
      />
    );
  }

  renderData(data) {
    const { shouldRenderMap } = this.state;

    if (shouldRenderMap) {
      return this.renderEventsMap(data);
    }

    return super.renderData(data);
  }
}

export const mapStateToProps = CmsListScreen.createMapStateToProps(
  state => state[ext()][EVENTS_TAG],
);

export const mapDispatchToProps = CmsListScreen.createMapDispatchToProps({
  triggerEvent,
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(connectStyle(ext('EventsScreen'))(currentLocation(EventsScreen)));
