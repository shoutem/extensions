import React, { PureComponent } from 'react';
import autoBindReact from 'auto-bind/react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { Linking, Platform } from 'react-native';
import { MapView } from 'shoutem.application';
import {
  Caption,
  Icon,
  Screen,
  Subtitle,
  TouchableOpacity,
  View,
} from '@shoutem/ui';

function createMarker(place) {
  return {
    latitude: _.get(place, 'geometry.location.lat'),
    longitude: _.get(place, 'geometry.location.lng'),
  };
}

export default class MapScreen extends PureComponent {
  static propTypes = {
    place: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);

    autoBindReact(this);

    this.marker = createMarker(props.place);
  }

  openDirections() {
    const {
      place: {
        geometry: {
          location: { lat, lng },
        },
        formatted_address: formattedAddress,
      },
    } = this.props;

    const mapUrl =
      Platform.OS === 'ios'
        ? `http://maps.apple.com/?ll=${lat},${lng}&q=${formattedAddress}`
        : `geo:${lat},${lng}?q=${formattedAddress}`;

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
    const { place } = this.props;
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
