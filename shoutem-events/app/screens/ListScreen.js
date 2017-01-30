import React from 'react';
import { connect } from 'react-redux';

import { navigateTo } from '@shoutem/core/navigation';
import { connectStyle } from '@shoutem/theme';
import { EmptyStateView, MapView } from '@shoutem/ui-addons';
import {
  View,
  Button,
  Text,
} from '@shoutem/ui';

import { CmsListScreen } from 'shoutem.cms';
import { triggerEvent } from 'shoutem.analytics';

import ListEventView from '../components/ListEventView';
import FeaturedEventView from '../components/FeaturedEventView';
import isValidEvent from '../shared/isValidEvent';
import { addToCalendar } from '../shared/Calendar';
import {
  EVENTS_SCHEME,
  EVENTS_TAG,
  ext,
} from '../const';

/**
 * Create markers out of events.
 * Filter events with location and bind event properties.
 *
 * @param events
 * @returns {*}
 */
function getMarkersFromEvents(events) {
  return events.filter(isValidEvent).map(event => ({
    latitude: parseFloat(event.latitude),
    longitude: parseFloat(event.longitude),
    title: event.address,
    event,
  }));
}

function hasFeaturedEvent(events) {
  return events.some(event => event.featured);
}

export class ListScreen extends CmsListScreen {
  static propTypes = {
    ...CmsListScreen.propTypes,
    navigateTo: React.PropTypes.func,
    // If true, map is shown as first view
    mapMode: React.PropTypes.bool,
  };

  constructor(props, context) {
    super(props, context);
    this.renderRow = this.renderRow.bind(this);
    this.openDetailsScreen = this.openDetailsScreen.bind(this);
    this.toggleMapViewMode = this.toggleMapViewMode.bind(this);
    this.addToCalendar = this.addToCalendar.bind(this);
    this.state = {
      ...this.state,
      schema: EVENTS_SCHEME,
      renderCategoriesInline: true,
      selectedMapEvent: null,
      mapMode: props.mapMode,
    };
  }

  openDetailsScreen(event) {
    this.props.navigateTo({
      screen: ext('DetailsScreen'),
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

  toggleMapViewMode() {
    this.setState({ mapMode: !this.state.mapMode });
  }

  renderCategoriesDropDown(styleName) {
    const { data } = this.props;
    let newStyleName = styleName;
    if (hasFeaturedEvent(data)) {
      newStyleName = newStyleName ? `${newStyleName} featured` : 'featured';
    }
    return super.renderCategoriesDropDown(newStyleName);
  }

  getNavBarProps() {
    const { data } = this.props;
    const newNavBarProps = super.getNavBarProps();

    newNavBarProps.renderRightComponent = () => (
      <View virtual styleName="container">
        <Button styleName="clear" onPress={this.toggleMapViewMode}>
          <Text styleName="regular">{this.state.mapMode ? 'List' : 'Map'}</Text>
        </Button>
      </View>
    );

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

  renderEventsMap(events) {
    const markers = getMarkersFromEvents(events);

    if (markers.length < 1) {
      return (
        <EmptyStateView
          message="Nothing to show on the map, events don't have location."
        />
      );
    }

    return (
      <MapView
        markers={markers}
        onMarkerPressed={(marker) => {
          this.setState({ selectedMapEvent: marker.event });
        }}
        onPress={() => {
          this.setState({ selectedMapEvent: null });
        }}
      />
    );
  }

  renderData(data) {
    const selectedMapEvent = this.state.selectedMapEvent;

    if (this.state.mapMode) {
      return (
        <View styleName="flexible">
          {this.renderEventsMap(data)}
          {selectedMapEvent ? this.renderEventListItem(selectedMapEvent, { height: 95 }) : null}
        </View>
      );
    }

    return super.renderData(data);
  }
}

export const mapStateToProps = CmsListScreen.createMapStateToProps(
  (state) => state[ext()][EVENTS_TAG]
);

export const mapDispatchToProps = CmsListScreen.createMapDispatchToProps({
  navigateTo,
  triggerEvent,
});

export default connect(mapStateToProps, mapDispatchToProps)(
  connectStyle(ext(ListScreen.name))(ListScreen)
);
