import React, {
  Component
} from 'react';
import {
  TouchableOpacity,
  Text,
  Divider,
  Row,
  View,
  Image,
  Caption,
  Subtitle,
  Screen
} from '@shoutem/ui';
import { CmsListScreen } from 'shoutem.cms';

import { MapView } from '@shoutem/ui-addons';

import { connect } from 'react-redux';
import { connectStyle } from '@shoutem/theme';
import { navigateTo, navigateBack } from '@shoutem/core/navigation';
import { ext } from '../const';
import {
  find,
} from '@shoutem/redux-io';

class MapList extends CmsListScreen {
  static propTypes = {
    ...CmsListScreen.propTypes,
  }

  constructor(props) {
    super(props);
    this.state = { selectedMarker: null };
    this.getMarkers = this.getMarkers.bind(this);
    this.renderImageRow = this.renderImageRow.bind(this);
    this.findSelectedPlace = this.findSelectedPlace.bind(this);
    this.setSelectedMarker = this.setSelectedMarker.bind(this);
    this.state = {
      ...this.state,
      schema: ext('places'),
      renderCategoriesInline: true,
    };
  }

  getNavBarProps() {
    return {
      ...super.getNavBarProps(),
      renderRightComponent() {
      <View styleName="container md-gutter-right">
        <TouchableOpacity
          onPress={() => navigateBack()}
        >
          <View><Text>List</Text></View>
        </TouchableOpacity>
      </View>;
      },
    };
  }

  findSelectedPlace() {
    const { selectedMarker } = this.state;
    const { places } = this.props;

    if (selectedMarker) {
      const selectedPlace = places.find(place => place.id === selectedMarker.placeId);

      if (selectedPlace) {
        return selectedPlace;
      }
    }
    return places[0];
  }

  getMarkers(places) {
    const markers = [];

    for (var i = 0; i < places.length; i++) {
      const place = places[i];
      if (place.latitude && place.longitude) {
        markers.push({
          latitude: parseFloat(place.latitude),
          longitude: parseFloat(place.longitude),
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
          placeId: place.id,
        });
      }
    }
    return (markers);
  }

  setSelectedMarker(selectedMarker) {
    this.setState({ selectedMarker });
  }

  getPlaceImage(place) {
    return place.image ? { uri: place.image.url } : require('../assets/data/no_image.png');
  }

  renderImageRow() {
    const { navigateTo } = this.props;
    const returnedPlace = this.findSelectedPlace();
    return (
      <TouchableOpacity
        onPress={() => navigateTo({
          screen: ext('PlaceDetails'),
          props: { place: returnedPlace },
        })}
      >
        <Row>
          <Image styleName="small rounded-corners" source={this.getPlaceImage(returnedPlace)} />
          <View styleName="vertical stretch space-between">
            <Subtitle numberOfLines={1}>{returnedPlace.name}</Subtitle>
            <Caption styleName="horizontal" numberOfLines={2}>{returnedPlace.address}</Caption>
          </View>
        </Row>
        <Divider styleName="line" />
      </TouchableOpacity>);
  }

  render() {
    const { places } = this.props;
    return (
      <Screen>
        <MapView
          markers={this.getMarkers(places)}
          onMarkerPressed={this.setSelectedMarker}
        />
        {this.renderImageRow()}
      </Screen>
    );
  }
}

export const mapStateToProps = CmsListScreen.createMapStateToProps(
  (state) => state[ext()].allPlaces,
);

export const mapDispatchToProps = CmsListScreen.createMapDispatchToProps({
  navigateTo,
  find,
  navigateBack,
});

export default connect(mapStateToProps, mapDispatchToProps)(
  connectStyle(ext('MapList'), {})(MapList),
);
