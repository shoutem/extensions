import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { Platform, Linking } from 'react-native';
import { Screen, Icon, Button, View } from '@shoutem/ui';
import { MapView } from 'shoutem.application';
import { NavigationBar } from 'shoutem.navigation';
import { getMapUrl } from '../shared/getMapUrl';

export default class SingleEventMapScreen extends PureComponent {
  static propTypes = {
    marker: PropTypes.object,
    title: PropTypes.string.isRequired,
  };

  constructor(props) {
    super(props);

    this.renderNavigateButton = this.renderNavigateButton.bind(this);
    this.openMaps = this.openMaps.bind(this);
  }

  openMaps() {
    const { marker, title } = this.props;
    const { latitude, longitude } = marker;

    if (latitude && longitude) {
      Linking.openURL(getMapUrl(latitude, longitude, title));
    }
  }

  renderNavigateButton() {
    return (
      <View styleName="container" virtual>
        <Button onPress={this.openMaps}>
          <Icon name="directions" />
        </Button>
      </View>
    );
  }

  render() {
    const { marker, title } = this.props;

    return (
      <Screen styleName="full-screen">
        <NavigationBar
          renderRightComponent={this.renderNavigateButton}
          styleName="no-border"
          title={title.toUpperCase()}
        />
        <MapView
          initialRegion={marker}
          markers={[marker]}
          selectedMarker={marker}
        />
      </Screen>
    );
  }
}
