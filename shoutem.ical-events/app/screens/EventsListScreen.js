import React from 'react';
import _ from 'lodash';
import { InteractionManager } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import moment from 'moment';

import { navigateTo } from '@shoutem/core/navigation';
import { connectStyle } from '@shoutem/theme';
import { View, Button, Text } from '@shoutem/ui';
import { find, next, getCollection, isInitialized } from '@shoutem/redux-io';

// TODO currentLocation should probably be extracted into shoutem.application
import { currentLocation } from 'shoutem.cms';
import { RemoteDataListScreen } from 'shoutem.application';
import { triggerEvent } from 'shoutem.analytics';
import { I18n } from 'shoutem.i18n';

import ListEventView from '../components/ListEventView';
import { addToCalendar } from '../services/Calendar';
import EventsMap from '../components/EventsMap';
import { ext } from '../extension';
import { EVENTS_PROXY_SCHEMA } from '../redux';

function hasFeaturedEvent(events) {
  return events.some(event => event.featured);
}

export class EventsListScreen extends RemoteDataListScreen {
  static propTypes = {
    ...RemoteDataListScreen.propTypes,
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
      renderCategoriesInline: true,
      shouldRenderMap: false,
    };
  }

  static componentWillReceiveProps(nextProps) {
    // check if we need user location
    const { sortField, checkPermissionStatus } = nextProps;

    const isSortByLocation = sortField === 'location';
    const isLocationAvailable = !!nextProps.currentLocation;

    if (isSortByLocation && !isLocationAvailable && _.isFunction(checkPermissionStatus)) {
      checkPermissionStatus();
    }
  }

  fetchData() {
    const { shortcut } = this.props;
    const icalUrl = _.get(shortcut, 'settings.icalUrl');

    const now = moment();
    const endDate = now.format('YYYY-MM-DD');

    InteractionManager.runAfterInteractions(() =>
      this.props.find(EVENTS_PROXY_SCHEMA, 'allEvents', {
        query: {
          url: icalUrl,
          'filter[endDate]': endDate, // filtering past events
          sort: 'startDate,-startTime',
        },
      }),
    );
  }

  openDetailsScreen(event) {
    this.props.navigateTo({
      screen: ext('EventDetailsScreen'),
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

  getNavigationBarProps(screenTitle = I18n.t('shoutem.cms.navBarListViewButton')) {
    const { data } = this.props;
    const { shouldRenderMap } = this.state;
    const newNavBarProps = super.getNavigationBarProps();

    newNavBarProps.renderRightComponent = () => {
      if (_.isEmpty(data) || !isInitialized(data)) {
        return null;
      }

      return (
        <View virtual styleName="container">
          <Button styleName="clear" onPress={this.toggleMapMode}>
          <Text>{shouldRenderMap ? screenTitle : I18n.t('shoutem.cms.navBarMapViewButton')}</Text>
          </Button>
        </View>
      );
    };

    if (hasFeaturedEvent(data)) {
      newNavBarProps.styleName = `${newNavBarProps.styleName || ''} featured`;
    }

    return newNavBarProps;
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

export function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    find,
    next,
    navigateTo,
    triggerEvent,
  }, dispatch);
}

export function mapStateToProps(state) {
  return {
    data: getCollection(state[ext()].allEvents, state),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(
  connectStyle(ext('EventsListScreen'))(currentLocation(EventsListScreen)),
);
