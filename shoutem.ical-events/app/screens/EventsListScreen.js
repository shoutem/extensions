import React from 'react';
import { InteractionManager } from 'react-native';
import { connect } from 'react-redux';
import autoBindReact from 'auto-bind/react';
import _ from 'lodash';
import moment from 'moment';
import { bindActionCreators } from 'redux';
import { find, isInitialized, next } from '@shoutem/redux-io';
import { connectStyle } from '@shoutem/theme';
import { EmptyStateView } from '@shoutem/ui';
import { triggerEvent } from 'shoutem.analytics';
import { RemoteDataListScreen } from 'shoutem.application';
import { currentLocation } from 'shoutem.cms';
import { I18n } from 'shoutem.i18n';
import {
  getRouteParams,
  HeaderTextButton,
  navigateTo,
} from 'shoutem.navigation';
import EventsMap from '../components/EventsMap';
import FeaturedEventView from '../components/FeaturedEventView';
import ListEventView from '../components/ListEventView';
import { ext } from '../const';
import { EVENTS_PROXY_SCHEMA, getIcalFeed } from '../redux';
import { addToCalendar } from '../services/Calendar';

export class EventsListScreen extends RemoteDataListScreen {
  static propTypes = {
    ...RemoteDataListScreen.propTypes,
  };

  constructor(props, context) {
    super(props, context);

    autoBindReact(this);

    this.state = {
      renderCategoriesInline: true,
      shouldRenderMap: false,
    };
  }

  componentDidMount() {
    const { navigation } = this.props;

    navigation.setOptions(this.getNavBarProps());

    this.refreshData();
  }

  componentDidUpdate(prevProps) {
    // check if we need user location
    const {
      checkPermissionStatus,
      currentLocation,
      sortField,
      navigation,
    } = this.props;

    navigation.setOptions(this.getNavBarProps());

    this.refreshData(prevProps);

    const isSortByLocation = sortField === 'location';
    const isLocationAvailable = !!currentLocation;

    if (
      isSortByLocation &&
      !isLocationAvailable &&
      _.isFunction(checkPermissionStatus)
    ) {
      checkPermissionStatus();
    }
  }

  fetchData() {
    const { icalUrl, find } = this.props;

    if (!icalUrl) {
      return;
    }

    const now = moment();
    const endDate = now.format('YYYY-MM-DD');

    InteractionManager.runAfterInteractions(() =>
      find(EVENTS_PROXY_SCHEMA, 'urlSpecificEvents', {
        query: {
          url: icalUrl,
          'filter[endDate]': endDate, // filtering past events
          sort: 'startDate,-startTime',
        },
      }),
    );
  }

  getNavBarProps() {
    return {
      headerRight: this.renderRightComponent,
    };
  }

  renderRightComponent(props) {
    const { data } = this.props;
    const { shouldRenderMap } = this.state;
    const screenTitle = I18n.t('shoutem.cms.navBarListViewButton');
    const mapTitle = I18n.t('shoutem.cms.navBarMapViewButton');

    if (_.isEmpty(data) || !isInitialized(data)) {
      return null;
    }

    const title = shouldRenderMap ? screenTitle : mapTitle;

    return (
      <HeaderTextButton {...props} title={title} onPress={this.toggleMapMode} />
    );
  }

  shouldRenderPlaceholderView(data) {
    const { icalUrl } = this.props;

    if (!icalUrl) {
      return true;
    }

    return super.shouldRenderPlaceholderView(data);
  }

  renderPlaceholderView(data) {
    const { icalUrl, style } = this.props;

    if (_.isUndefined(icalUrl)) {
      // If feed doesn't exist (`icalUrl` is undefined), notify user to specify feed URL
      // and reload app, because `icalUrl` is retrieved through app configuration (builder)
      const emptyStateViewProps = {
        icon: 'error',
        message: I18n.t(ext('noUrlMessage')),
        style: style.emptyState,
      };

      return <EmptyStateView {...emptyStateViewProps} />;
    }

    return super.renderPlaceholderView(data);
  }

  openDetailsScreen(event) {
    navigateTo(ext('EventDetailsScreen'), {
      title: event.name,
      event,
      analyticsPayload: {
        itemId: event.id,
        itemName: event.title,
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

  renderFeaturedItem(event) {
    const { screenSettings } = getRouteParams(this.props);

    return screenSettings.hasFeaturedItem && event ? (
      <FeaturedEventView
        event={event}
        onPress={this.openDetailsScreen}
        action={this.addToCalendar}
      />
    ) : null;
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

    if (this.shouldRenderPlaceholderView(data)) {
      return this.renderPlaceholderView(data);
    }

    return super.renderData(data);
  }
}

export function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      find,
      next,
      triggerEvent,
    },
    dispatch,
  );
}

export function mapStateToProps(state, ownProps) {
  const { shortcut } = getRouteParams(ownProps);
  const icalUrl = _.get(shortcut, 'settings.icalUrl');

  return {
    icalUrl,
    data: getIcalFeed(state, icalUrl),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(connectStyle(ext('EventsListScreen'))(currentLocation(EventsListScreen)));
