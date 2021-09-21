import React, { useEffect } from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { Linking } from 'react-native';
import { View, Screen, TouchableOpacity, Icon } from '@shoutem/ui';
import { MapList } from '../components';
import { getMapUrl } from '../services/places';
import { getRouteParams } from 'shoutem.navigation';

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
