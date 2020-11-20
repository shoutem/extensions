import React, { PureComponent } from 'react';
import autoBindReact from 'auto-bind/react';
import PropTypes from 'prop-types';
import { Platform, Linking } from 'react-native';

import { Screen, Button, Icon, View } from '@shoutem/ui';

import { MapView } from 'shoutem.application';
import { NavigationBar } from 'shoutem.navigation';

import { getMapUrl } from '../services'

export default class MapScreen extends PureComponent {
  static propTypes = {
    marker: PropTypes.object,
    title: PropTypes.string,
  };

  constructor(props) {
    super(props);

    autoBindReact(this);
  }

  openMaps() {
    const { marker } = this.props;
    const { latitude, longitude, title } = marker;

    if (latitude && longitude) {
      Linking.openURL(getMapUrl(latitude, longitude, title));
    }
  }

  renderNavigateButton() {
    return (
      <View virtual styleName="container">
        <Button onPress={this.openMaps}>
          <Icon name="directions" />
        </Button>
      </View>
    );
  }

  render() {
    const { marker, title } = this.props;

    const region = {
      latitude: marker.latitude,
      longitude: marker.longitude,
      latitudeDelta: 0.03,
      longitudeDelta: 0.03,
    };

    return (
      <Screen styleName="full-screen">
        <NavigationBar
          styleName="no-border"
          title={title.toUpperCase()}
          renderRightComponent={this.renderNavigateButton}
        />

        <MapView
          markers={[marker]}
          selectedMarker={marker}
          initialRegion={region}
        />
      </Screen>
    );
  }
}
