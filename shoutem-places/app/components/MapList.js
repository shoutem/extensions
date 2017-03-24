import React, { Component } from 'react';
import { LayoutAnimation } from 'react-native';
import { connect } from 'react-redux';
import { connectStyle } from '@shoutem/theme';
import _ from 'lodash';
import {
  TouchableOpacity,
  Divider,
  Row,
  View,
  Image,
  Caption,
  Subtitle,
} from '@shoutem/ui';
import { MapView } from '@shoutem/ui-addons';
import { navigateTo } from '@shoutem/core/navigation';
import { ext } from '../const';

export class MapList extends Component {

  constructor(props) {
    super(props);
    const { selectedPlace } = this.props;

    this.createMarkersFromPlaces = this.createMarkersFromPlaces.bind(this);
    this.renderImageRow = this.renderImageRow.bind(this);
    this.findSelectedPlace = this.findSelectedPlace.bind(this);
    this.setSelectedMarker = this.setSelectedMarker.bind(this);
    this.state = {
      ...this.state,
      selectedMarker: this.createMarker(selectedPlace),
    };
  }

  setSelectedMarker(selectedMarker) {
    LayoutAnimation.easeInEaseOut();
    this.setState({ selectedMarker });
  }

  createMarker(place) {
    if (!place) {
      return undefined;
    }

    const { location = {} } = place;
    const { latitude, longitude } = location;

    if (latitude && longitude) {
      return {
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
        placeId: place.id,
      };
    }
    return undefined;
  }

  createMarkersFromPlaces(places) {
    return _.reduce(places, (result, place) => {
      const marker = this.createMarker(place);

      if (marker) {
        result.push(marker);
      }
      return result;
    },
    []);
  }

  findSelectedPlace() {
    const { selectedMarker } = this.state;
    const { places } = this.props;

    if (!selectedMarker) {
      return null;
    }
    const selectedPlace = places.find(place => place.id === selectedMarker.placeId);
    return selectedPlace;
  }

  renderImageRow() {
    const { navigateTo } = this.props;
    const returnedPlace = this.findSelectedPlace();
    const { image, name, address } = returnedPlace;

    return (
      <TouchableOpacity
        onPress={() => navigateTo({
          screen: ext('PlaceDetails'),
          props: { place: returnedPlace },
        })}
      >
        <Row>
          <Image
            styleName="small rounded-corners"
            source={image ? { uri: image.url } :
            require('../assets/data/no_image.png')}
          />
          <View styleName="vertical stretch space-between">
            <Subtitle numberOfLines={1}>{name}</Subtitle>
            <Caption styleName="horizontal" numberOfLines={2}>{address}</Caption>
          </View>
        </Row>
        <Divider styleName="line" />
      </TouchableOpacity>);
  }

  render() {
    const { places, initialRegion } = this.props;
    const { selectedMarker } = this.state;
    const printImageRow = (selectedMarker) ? this.renderImageRow() : null;
    const markers = this.createMarkersFromPlaces(places);
    return (
      <View styleName="flexible">
        <View styleName="flexible">
          <MapView
            markers={markers}
            onMarkerPressed={this.setSelectedMarker}
            initialRegion={initialRegion}
            selectedMarker={selectedMarker}
          />
        </View>
        {printImageRow}
      </View>
    );
  }
}

export default connect(undefined, { navigateTo })(
    connectStyle(ext('MapList'))(MapList),
  );

MapList.propTypes = {
  places: React.PropTypes.array.isRequired,
  selectedPlace: React.PropTypes.object,
  initialRegion: React.PropTypes.object,
  navigateTo: React.PropTypes.func,
};

MapList.defaultProps = {
  selectedPlace: undefined,
  initialRegion: undefined,
};
