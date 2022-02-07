import React, { PureComponent } from 'react';
import { LayoutAnimation } from 'react-native';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { connectStyle } from '@shoutem/theme';
import { EmptyStateView, View } from '@shoutem/ui';
import { MapView } from 'shoutem.application';
import { I18n } from 'shoutem.i18n';
import { ext } from '../const';
import PlaceIconView from './PlaceIconView';

function findSelectedPlace(places, marker) {
  if (_.isEmpty(places) || !marker) {
    return undefined;
  }

  const selectedPlace = places.find(place => place.id === marker.placeId);

  return selectedPlace;
}

function createMarker(place) {
  if (!place) {
    return undefined;
  }

  const { location = {} } = place;
  const { latitude, longitude } = location;

  if (!latitude && !longitude) {
    return undefined;
  }

  return {
    latitude: parseFloat(latitude),
    longitude: parseFloat(longitude),
    placeId: place.id,
  };
}

function createMarkersFromPlaces(places) {
  return _.reduce(
    places,
    (result, place) => {
      const marker = createMarker(place);

      if (marker) {
        result.push(marker);
      }
      return result;
    },
    [],
  );
}

export class MapList extends PureComponent {
  constructor(props) {
    super(props);

    this.renderImageRow = this.renderImageRow.bind(this);
    this.setSelectedMarker = this.setSelectedMarker.bind(this);

    const { selectedPlace } = this.props;

    this.state = {
      schema: ext('places'),
      selectedMarker: createMarker(selectedPlace),
    };
  }

  componentDidMount() {
    const { places } = this.props;

    const markers = createMarkersFromPlaces(places);
    const region = _.isEmpty(markers)
      ? undefined
      : this.resolveInitialRegion(markers);

    LayoutAnimation.easeInEaseOut();
    // eslint-disable-next-line react/no-did-mount-set-state
    this.setState({ markers, region });
  }

  static getDerivedStateFromProps(props, state) {
    const { places } = props;
    const { places: statePlaces } = state;

    if (places === statePlaces) {
      return state;
    }

    const { selectedMarker } = state;

    const markedPlace = findSelectedPlace(places, selectedMarker);
    const markers = createMarkersFromPlaces(places);

    LayoutAnimation.easeInEaseOut();
    return {
      markers,
      places,
      selectedMarker: markedPlace ? selectedMarker : undefined,
    };
  }

  setSelectedMarker(selectedMarker) {
    this.setState({ selectedMarker });
    LayoutAnimation.easeInEaseOut();
  }

  resolveInitialRegion(markers) {
    const { initialRegion } = this.props;

    const defaultRegion = {
      ..._.first(markers),
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    };

    return initialRegion || defaultRegion;
  }

  renderImageRow() {
    const { places } = this.props;
    const { selectedMarker } = this.state;

    const returnedPlace = findSelectedPlace(places, selectedMarker);

    return <PlaceIconView place={returnedPlace} />;
  }

  render() {
    const { selectedMarker, markers, region } = this.state;
    const printImageRow = selectedMarker ? this.renderImageRow() : null;

    if (_.isEmpty(markers)) {
      return (
        <EmptyStateView
          icon="address"
          message={I18n.t('shoutem.cms.noLocationsProvidedErrorMessage')}
        />
      );
    }

    return (
      <View styleName="flexible">
        <View styleName="flexible">
          <MapView
            markers={markers}
            onMarkerPressed={this.setSelectedMarker}
            initialRegion={region}
            selectedMarker={selectedMarker}
          />
        </View>
        {printImageRow}
      </View>
    );
  }
}

export default connectStyle(ext('MapList'))(MapList);

MapList.propTypes = {
  places: PropTypes.array.isRequired,
  selectedPlace: PropTypes.object,
  initialRegion: PropTypes.object,
};

MapList.defaultProps = {
  selectedPlace: undefined,
  initialRegion: undefined,
};
