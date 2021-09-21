import React, { PureComponent } from 'react';
import autoBindReact from 'auto-bind/react';
import PropTypes from 'prop-types';
import { Linking } from 'react-native';
import { Screen, Icon, Button, View } from '@shoutem/ui';
import { MapView } from 'shoutem.application';
import { composeNavigationStyles, getRouteParams } from 'shoutem.navigation';
import { getMapUrl } from '../shared/getMapUrl';

export default class SingleEventMapScreen extends PureComponent {
  static propTypes = {
    navigation: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);

    autoBindReact(this);
  }

  componentDidMount() {
    const { navigation } = this.props;
    const {
      event: { title = '' },
    } = getRouteParams(this.props);

    navigation.setOptions({
      ...composeNavigationStyles(['noBorder']),
      headerRight: this.headerRight,
      title,
    });
  }

  openMaps() {
    const {
      event: { marker, title },
    } = getRouteParams(this.props);
    const { latitude, longitude } = marker;

    if (latitude && longitude) {
      Linking.openURL(getMapUrl(latitude, longitude, title));
    }
  }

  headerRight(props) {
    return (
      <View styleName="container">
        <Button styleName="clear" onPress={this.openMaps}>
          <Icon name="directions" style={props.tintColor} />
        </Button>
      </View>
    );
  }

  render() {
    const {
      event: { marker },
    } = getRouteParams(this.props);

    return (
      <Screen>
        <MapView
          initialRegion={marker}
          markers={[marker]}
          selectedMarker={marker}
        />
      </Screen>
    );
  }
}
