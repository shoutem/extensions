import React, { useEffect } from 'react';
import { Linking } from 'react-native';
import PropTypes from 'prop-types';
import { Screen } from '@shoutem/ui';
import { MapView } from 'shoutem.application';
import {
  composeNavigationStyles,
  getRouteParams,
  HeaderIconButton,
} from 'shoutem.navigation';
import { getMapUrl } from '../services';

function handleOpenMaps(marker) {
  const { latitude, longitude, title } = marker;

  if (latitude && longitude) {
    Linking.openURL(getMapUrl(latitude, longitude, title));
  }
}

function MapScreen(props) {
  const { navigation } = props;
  const { title, marker } = getRouteParams(props);

  useEffect(() => {
    navigation.setOptions({
      ...composeNavigationStyles(['noBorder']),
      headerRight: props => (
        <HeaderIconButton
          iconName="directions"
          onPress={() => handleOpenMaps(marker)}
          {...props}
        />
      ),
      title,
    });
  });

  const region = {
    latitude: marker.latitude,
    longitude: marker.longitude,
    latitudeDelta: 0.03,
    longitudeDelta: 0.03,
  };

  return (
    <Screen>
      <MapView
        markers={[marker]}
        selectedMarker={marker}
        initialRegion={region}
      />
    </Screen>
  );
}

MapScreen.propTypes = {
  navigation: PropTypes.object.isRequired,
};

export default MapScreen;
