import React from 'react';
import { InteractionManager } from 'react-native';
import { connect } from 'react-redux';
import _ from 'lodash';

import { navigateTo } from '@shoutem/core/navigation';
import { connectStyle } from '@shoutem/theme';
import {
  View,
  Button,
  Text,
} from '@shoutem/ui';
import { isInitialized } from '@shoutem/redux-io';

import { CmsListScreen, currentLocation } from 'shoutem.cms';
import { triggerEvent } from 'shoutem.analytics';

import ListEventView from '../components/ListEventView';
import FeaturedEventView from '../components/FeaturedEventView';
import { addToCalendar } from '../shared/Calendar';
import EventsMap from '../components/EventsMap';
import {
  EVENTS_SCHEME,
  EVENTS_TAG,
  ext,
} from '../const';

function hasFeaturedEvent(events) {
  return events.some(event => event.featured);
}

export class ListScreen extends CmsListScreen {
  static propTypes = {
    ...CmsListScreen.propTypes,
    navigateTo: React.PropTypes.func,
  };

  constructor(props, context) {
    super(props, context);
    this.fetchData = this.fetchData.bind(this);
    this.renderRow = this.renderRow.bind(this);
    this.openDetailsScreen = this.openDetailsScreen.bind(this);
    this.toggleMapMode = this.toggleMapMode.bind(this);
    this.addToCalendar = this.addToCalendar.bind(this);
    this.state = {
      ...this.state,
      schema: EVENTS_SCHEME,
      renderCategoriesInline: true,
      shouldRenderMap: false,
    };
  }

  componentWillReceiveProps(nextProps) {
    // check if we need user location
    const { sortField, checkPermissionStatus } = nextProps;

    const isSortByLocation = sortField === 'location';
    const isLocationAvailable = !!nextProps.currentLocation;

    if (isSortByLocation && !isLocationAvailable && _.isFunction(checkPermissionStatus)) {
      checkPermissionStatus();
    }

    super.componentWillReceiveProps(nextProps);
  }

  fetchData(options) {
    const { find } = this.props;
    const { schema } = this.state;

    const queryParams = super.getQueryParams(options);
    InteractionManager.runAfterInteractions(() =>
      find(schema, undefined, {
        ...queryParams,
        'filter[endTime][gt]': (new Date()).toISOString(), // filtering past events
      }),
    );
  }

  openDetailsScreen(event) {
    this.props.navigateTo({
      screen: ext('DetailsScreenWithLargePhoto'),
      title: event.name,
      props: {
        event,
      },
    });
  }

  addToCalendar(event) {
    addToCalendar(event);
    this.props.triggerEvent('Event', 'Add to calendar', { label: event.name });
  }

  toggleMapMode() {
    const { shouldRenderMap } = this.state;
    this.setState({ shouldRenderMap: !shouldRenderMap });
  }

  renderCategoriesDropDown(styleName) {
    const { data } = this.props;
    let newStyleName = styleName;
    if (hasFeaturedEvent(data)) {
      newStyleName = newStyleName ? `${newStyleName} featured` : 'featured';
    }
    return super.renderCategoriesDropDown(newStyleName);
  }

  getNavBarProps(screenTitle = 'List') {
    const { data } = this.props;
    const { shouldRenderMap } = this.state;
    const newNavBarProps = super.getNavBarProps();

    newNavBarProps.renderRightComponent = () => {
      if (_.isEmpty(data) || !isInitialized(data)) {
        return null;
      }

      return (
        <View virtual styleName="container">
          <Button styleName="clear" onPress={this.toggleMapMode}>
            <Text>{shouldRenderMap ? screenTitle : 'Map'}</Text>
          </Button>
        </View>
      );
    };

    if (hasFeaturedEvent(data)) {
      newNavBarProps.styleName = `${newNavBarProps.styleName || ''} featured`;
    }

    return newNavBarProps;
  }

  renderFeaturedEvent(event) {
    const { categories } = this.props;
    return (
      <FeaturedEventView
        event={event}
        onPress={this.openDetailsScreen}
        action={this.addToCalendar}
        styleName={categories.length > 1 ? 'dimmed' : ''}
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

  renderRow(event) {
    if (event.featured) {
      return this.renderFeaturedEvent(event);
    }
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
  navigateTo,
  triggerEvent,
});

export default connect(mapStateToProps, mapDispatchToProps)(
  connectStyle(ext('ListScreen'))(currentLocation(ListScreen)),
);
