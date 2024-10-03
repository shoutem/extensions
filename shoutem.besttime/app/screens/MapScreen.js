import React, { PureComponent } from 'react';
import { Linking } from 'react-native';
import autoBindReact from 'auto-bind/react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import {
  Caption,
  Icon,
  Screen,
  Subtitle,
  TouchableOpacity,
  View,
} from '@shoutem/ui';
import { MapView } from 'shoutem.application';
import { getMapUrl } from 'shoutem.cms';
import { getRouteParams } from 'shoutem.navigation';

function createMarker(place) {
  return {
    latitude: _.get(place, 'geometry.location.lat'),
    longitude: _.get(place, 'geometry.location.lng'),
  };
}

export default class MapScreen extends PureComponent {
  static propTypes = {
    navigation: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);

    autoBindReact(this);

    const { place } = getRouteParams(props);
    this.marker = createMarker(place);
  }

  openDirections() {
    const {
      place: {
        geometry: {
          location: { lat, lng },
        },
        formatted_address: formattedAddress,
      },
    } = getRouteParams(this.props);

    const mapUrl = getMapUrl(lat, lng, formattedAddress);

    Linking.openURL(mapUrl);
  }

  resolveRegion() {
    return {
      ...this.marker,
      latitudeDelta: 0.005,
      longitudeDelta: 0.005,
    };
  }

  render() {
    const { place } = getRouteParams(this.props);
    const { formatted_address: formattedAddress, name } = place;

    return (
      <Screen>
        <MapView
          markers={[this.marker]}
          onMarkerPressed={this.setSelectedMarker}
          initialRegion={this.resolveRegion()}
          selectedMarker={this.marker}
        />
        <View styleName="horizontal v-center md-gutter space-between">
          <View styleName="vertical space-between">
            <Subtitle numberOfLines={2}>{name}</Subtitle>
            <View styleName="horizontal">
              <Caption>{formattedAddress}</Caption>
            </View>
          </View>
          <TouchableOpacity onPress={this.openDirections}>
            <Icon name="directions" />
          </TouchableOpacity>
        </View>
      </Screen>
    );
  }
}
