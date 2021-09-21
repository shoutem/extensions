import React, { PureComponent } from 'react';
import autoBindReact from 'auto-bind/react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { LayoutAnimation } from 'react-native';
import { MapView } from 'shoutem.application';
import { View } from '@shoutem/ui';
import ListEventView from '../components/ListEventView';
import isValidEvent from '../shared/isValidEvent';

/**
 * Create markers out of events.
 * Filter events with location and bind event properties.
 *
 * @param events
 * @returns {*}
 */
function getMarkersFromEvents(events) {
  return events.filter(isValidEvent).map(event => ({
    latitude: parseFloat(event.location.latitude),
    longitude: parseFloat(event.location.longitude),
    event,
  }));
}

/**
 * Retrieves initial region from all available events
 * In order to find initial region when we have multiple events, we're calculating mean
 * latitude and longitude values for all events. Also, latitudeDelta and longitudeDelta
 * values are calculated as difference between max latitude (longitude) and min (longitude)
 *
 * @param events
 * @returns {*}
 */

function getCoordinatesDelta(events, coordinateName) {
  return (
    _.maxBy(events, coordinateName)[coordinateName] -
    _.minBy(events, coordinateName)[coordinateName]
  );
}

function getInitialRegionFromEvents(events) {
  const defaultLatitudeDelta = 0.01;
  const defaultLongitudeDelta = 0.01;

  const validEvents = _.map(_.filter(events, isValidEvent), event => {
    return {
      latitude: parseFloat(_.get(event, 'location.latitude')),
      longitude: parseFloat(_.get(event, 'location.longitude')),
    };
  });

  if (_.isEmpty(validEvents)) {
    return null;
  }

  const latitudeDelta =
    getCoordinatesDelta(validEvents, 'latitude') || defaultLatitudeDelta;
  const longitudeDelta =
    getCoordinatesDelta(validEvents, 'longitude') || defaultLongitudeDelta;

  return {
    latitude: _.meanBy(validEvents, 'latitude'),
    longitude: _.meanBy(validEvents, 'longitude'),
    latitudeDelta: latitudeDelta * 1.5,
    longitudeDelta: longitudeDelta * 1.5,
  };
}

function getMarkersAndRegionFromEvents(data) {
  if (!data || _.isEmpty(data)) {
    return {
      markers: [],
      region: undefined,
    };
  }

  return {
    markers: getMarkersFromEvents(data),
    region: getInitialRegionFromEvents(data),
  };
}

export default class EventsMap extends PureComponent {
  static propTypes = {
    data: PropTypes.array.isRequired,
    style: PropTypes.object.isRequired,
    addToCalendar: PropTypes.func.isRequired,
    openDetailsScreen: PropTypes.func.isRequired,
  };

  static getDerivedStateFromProps(props, state) {
    // while storing `data` in state is not a good idea,
    // it is the lesser of two evils compared to recalculating
    // markers and region on each component render
    if (state.data !== props.data) {
      LayoutAnimation.easeInEaseOut();

      return {
        data: props.data,
        ...getMarkersAndRegionFromEvents(props.data),
      };
    }

    return state;
  }

  constructor(props, context) {
    super(props, context);

    autoBindReact(this);

    this.state = {
      selectedEvent: null,
      ...getMarkersAndRegionFromEvents(this.props.data),
    };
  }

  handleMapPress(event) {
    const { selectedEvent } = this.state;

    if (event.nativeEvent.action !== 'marker-press' && selectedEvent) {
      LayoutAnimation.easeInEaseOut();
      this.setState({ selectedEvent: null });
    }
  }

  renderEventListItem(event, style = {}) {
    const { addToCalendar, openDetailsScreen } = this.props;

    return (
      <ListEventView
        event={event}
        onPress={openDetailsScreen}
        action={addToCalendar}
        style={style}
      />
    );
  }

  renderEventsMap() {
    const { markers, region } = this.state;

    return (
      <MapView
        markers={markers}
        initialRegion={region}
        onMarkerPressed={marker => {
          LayoutAnimation.easeInEaseOut();
          this.setState({ selectedEvent: marker.event });
        }}
        onPress={this.handleMapPress}
      />
    );
  }

  render() {
    const { style } = this.props;
    const { selectedEvent } = this.state;

    return (
      <View styleName="flexible">
        {this.renderEventsMap()}
        {selectedEvent
          ? this.renderEventListItem(selectedEvent, style.eventDetails)
          : null}
      </View>
    );
  }
}
