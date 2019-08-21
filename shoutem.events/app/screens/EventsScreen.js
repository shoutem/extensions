import PropTypes from 'prop-types';
import React from 'react';
import { InteractionManager } from 'react-native';
import { connect } from 'react-redux';
import _ from 'lodash';

import { navigateTo } from 'shoutem.navigation';
import { connectStyle } from '@shoutem/theme';
import {
  View,
  Button,
  Text,
} from '@shoutem/ui';
import { isInitialized } from '@shoutem/redux-io';

import { CmsListScreen, currentLocation } from 'shoutem.cms';
import { I18n } from 'shoutem.i18n';
import { triggerEvent } from 'shoutem.analytics';
import FeaturedEventView from '../components/FeaturedEventView';
import { addToCalendar } from '../shared/Calendar';
import EventsMap from '../components/EventsMap';
import { createListItem } from '../components/ListItemViewFactory';

import {
  EVENTS_SCHEME,
  EVENTS_TAG,
  ext,
} from '../const';

export class EventsScreen extends CmsListScreen {
  static propTypes = {
    ...CmsListScreen.propTypes,
    navigateTo: PropTypes.func,
  };

  constructor(props, context) {
    super(props, context);

    this.fetchData = this.fetchData.bind(this);
    this.renderRow = this.renderRow.bind(this);
    this.renderFeaturedItem = this.renderFeaturedItem.bind(this);
    this.openDetailsScreen = this.openDetailsScreen.bind(this);
    this.toggleMapMode = this.toggleMapMode.bind(this);
    this.addToCalendar = this.addToCalendar.bind(this);
    this.state = {
      ...this.state,
      schema: EVENTS_SCHEME,
      renderCategoriesInline: true,
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

    InteractionManager.runAfterInteractions(() =>
      find(schema, undefined, {
        query: this.getQueryParams(options),
      }),
    );
  }

  getQueryParams(options) {
    const queryParams = super.getQueryParams(options);

    return {
      ...queryParams,
      'filter[endTime][gt]': (new Date()).toISOString(), // filtering past events
    };
  }

  openDetailsScreen(event) {
    const { navigateTo } = this.props;

    navigateTo({
      screen: ext('EventDetailsScreen'),
      title: event.name,
      props: {
        event,
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

  renderCategoriesDropDown(styleName) {
    const { data } = this.props;

    let newStyleName = styleName;

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
            <Text>{shouldRenderMap ? this.navBarViewTitle.list : this.navBarViewTitle.map}</Text>
          </Button>
        </View>
      );
    };

    return newNavBarProps;
  }

  renderFeaturedItem(item) {
    const { hasFeaturedItem } = this.props;

    return hasFeaturedItem ? (
      <FeaturedEventView
        event={item}
        onPress={this.openDetailsScreen}
        action={this.addToCalendar}
      />) : null;
  }

  renderEventListItem(event, style = {}) {
    const { listType } = this.props;

    return createListItem(listType, event, this.openDetailsScreen,
      this.addToCalendar, style);
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
  navigateTo,
  triggerEvent,
});

export default connect(mapStateToProps, mapDispatchToProps)(
  connectStyle(ext('EventsScreen'))(currentLocation(EventsScreen)),
);
