import React, {
  PureComponent,
} from 'react';
import {
  Platform,
  Linking,
} from 'react-native';

import { I18n } from 'shoutem.i18n';

import {
  Screen,
  Text,
  Button,
  View,
} from '@shoutem/ui';
import { NavigationBar } from '@shoutem/ui/navigation';

import { MapView } from '@shoutem/ui-addons';

import { ext } from '../const';

export default class SingleEventMapScreen extends PureComponent {
  static propTypes = {
    marker: React.PropTypes.object,
    title: React.PropTypes.string.isRequired,
  };

  constructor(props) {
    super(props);

    this.renderNavigateButton = this.renderNavigateButton.bind(this);
    this.openMaps = this.openMaps.bind(this);
  }

  openMaps() {
    const { marker } = this.props;
    const geoURL = `geo:${marker.latitude},${marker.longitude}`;

    Linking.canOpenURL(geoURL).then((supported) => {
      if (supported) {
        Linking.openURL(geoURL);
      } else {
        Linking.openURL(`http://maps.apple.com/?ll=${marker.latitude},${marker.longitude}`);
      }
    });
  }

  renderNavigateButton() {
    if (Platform.OS === 'ios') {
      return (
        <View virtual styleName="container">
          <Button onPress={this.openMaps}>
            <Text>{I18n.t('shoutem.cms.directionsButton')}</Text>
          </Button>
        </View>
      );
    }
    return null;
  }

  render() {
    const { marker, title } = this.props;

    return (
      <Screen styleName="full-screen">
        <NavigationBar
          styleName="no-border"
          title={title.toUpperCase()}
          renderRightComponent={this.renderNavigateButton}
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
