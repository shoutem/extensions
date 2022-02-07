import React, { useEffect } from 'react';
import { Linking } from 'react-native';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { Icon, Screen, TouchableOpacity, View } from '@shoutem/ui';
import { getRouteParams } from 'shoutem.navigation';
import { MapList } from '../components';
import { getMapUrl } from '../services/places';

const openMapLink = place => {
  const location = _.get(place, 'location', {});
  const { latitude, longitude, formattedAddress } = location;

  if (latitude && longitude) {
    Linking.openURL(getMapUrl(latitude, longitude, formattedAddress));
  }
};

const renderRightNavBarComponent = place => {
  return (
    <View styleName="container md-gutter-right">
      <TouchableOpacity onPress={() => openMapLink(place)}>
        <Icon name="directions" />
      </TouchableOpacity>
    </View>
  );
};

const SinglePlaceMap = props => {
  const { navigation } = props;
  const { place, title } = getRouteParams(props);

  useEffect(() => {
    navigation.setOptions({
      title,
      headerRight: () => renderRightNavBarComponent(place),
    });
  });

  return (
    <Screen>
      <MapList places={[place]} selectedPlace={place} />
    </Screen>
  );
};

SinglePlaceMap.propTypes = {
  navigation: PropTypes.object,
};

export default SinglePlaceMap;
