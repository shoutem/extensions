import React, { PureComponent } from 'react';
import autoBindReact from 'auto-bind/react';
import PropTypes from 'prop-types';
import { Platform, Linking } from 'react-native';
import { Screen, Text, Button } from '@shoutem/ui';
import { MapView } from 'shoutem.application';
import { I18n } from 'shoutem.i18n';
import { getRouteParams, HeaderStyles } from 'shoutem.navigation';

export default class EventMapScreen extends PureComponent {
  static propTypes = {
    navigation: PropTypes.shape({
      route: PropTypes.shape({
        params: PropTypes.shape({
          event: PropTypes.object,
          title: PropTypes.string.isRequired,
        }),
      }),
    }),
  };

  constructor(props) {
    super(props);

    autoBindReact(this);
  }

  componentDidMount() {
    const { navigation } = this.props;

    navigation.setOptions({
      ...HeaderStyles.noBorder,
      headerRight: this.headerRight,
    });
  }

  openMaps() {
    const {
      event: { marker },
    } = getRouteParams(this.props);
    const geoURL = `geo:${marker.latitude},${marker.longitude}`;

    Linking.canOpenURL(geoURL).then(supported => {
      if (supported) {
        Linking.openURL(geoURL);
      } else {
        Linking.openURL(
          `http://maps.apple.com/?ll=${marker.latitude},${marker.longitude}`,
        );
      }
    });
  }

  headerRight(props) {
    if (Platform.OS === 'ios') {
      return (
        <Button styleName="clear" onPress={this.openMaps}>
          <Text style={props.tintColor}>
            {I18n.t('shoutem.cms.directionsButton')}
          </Text>
        </Button>
      );
    }
    return null;
  }

  render() {
    const {
      event: { marker },
    } = getRouteParams(this.props);

    return (
      <Screen>
        <MapView region={marker} markers={[marker]} selectedMarker={marker} />
      </Screen>
    );
  }
}
