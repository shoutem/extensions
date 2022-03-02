import React, { useLayoutEffect, useMemo, useRef, useState } from 'react';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { useSelector } from 'react-redux';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { connectStyle } from '@shoutem/theme';
import { Icon, Image, Text, Touchable, View } from '@shoutem/ui';
import { I18n } from 'shoutem.i18n';
import { images } from '../assets';
import { ConfirmationModal } from '../components';
import { ext } from '../const';
import { getGingerGooglePlacesApiKey } from '../redux';

function SelectLocationScreen({
  navigation,
  style,
  route: {
    params: { onLocationSelected },
  },
}) {
  const [errorModalActive, setErrorModalActive] = useState(false);
  const [error, setError] = useState('');

  const inputRef = useRef();

  const apiKey = useSelector(getGingerGooglePlacesApiKey);
  const googlePlacesQuery = useMemo(
    () => ({
      key: apiKey,
      language: 'en',
      components: 'country:us',
    }),
    [apiKey],
  );

  useLayoutEffect(
    () =>
      navigation.setOptions({
        title: I18n.t(ext('selectLocationNavBarTitle')),
      }),
    [navigation],
  );

  function handlePlacePress(_data, details) {
    const addressParts = _.get(details, 'address_components', []);
    const stateSubdivision = _.find(addressParts, part =>
      _.includes(part.types, 'administrative_area_level_1'),
    );
    const hasStreetNumber = _.find(addressParts, part =>
      _.includes(part.types, 'street_number'),
    );
    const isInCalifornia = stateSubdivision.short_name === 'CA';

    if (!isInCalifornia) {
      setError(I18n.t(ext('locationScreenInvalidCountryMessage')));
      setErrorModalActive(true);
      return;
    }

    if (!hasStreetNumber) {
      setError(I18n.t(ext('locationScreenInvalidStreetMessage')));
      setErrorModalActive(true);
      return;
    }

    onLocationSelected({
      address: details.formatted_address,
      googlePlaceId: details.place_id,
      location: details.geometry.location,
    });
  }

  function renderItem(data, index) {
    const resolvedText =
      data.description || data.formatted_address || data.name;

    if (index === 0 && data.isCurrentLocation) {
      return (
        <View
          styleName="fill-parent horizontal"
          style={style.currentLocationContainer}
        >
          <Image source={images.location} style={style.currentLocationIcon} />
          <Text style={style.listItem}>{resolvedText}</Text>
        </View>
      );
    }

    const isFirstItem = index === 0;
    const isLastItem = index === 4;

    const resolvedStyle = [
      style.listItemContainer,
      isFirstItem && style.firstItemContainer,
      isLastItem && style.lastItemContainer,
    ];

    return (
      <View styleName="fill-parent" style={resolvedStyle}>
        <Text style={style.listItem}>{resolvedText}</Text>
      </View>
    );
  }

  function clearInput() {
    inputRef.current?.setAddressText('');
    return inputRef.current?.clear();
  }

  function renderClearButton() {
    return (
      <Touchable style={style.closeIconContainer} onPress={clearInput}>
        <Icon name="close" style={style.closeIcon} />
      </Touchable>
    );
  }

  const textInputProps = {
    placeholderTextColor: style.placeholderColor,
    clearButtonMode: 'never',
  };

  return (
    <View style={style.container}>
      <Image style={style.image} source={images.house} />
      <View styleName="fill-parent" style={style.autocompleteContainer}>
        <GooglePlacesAutocomplete
          ref={inputRef}
          placeholder={I18n.t(ext('locationScreenPlaceholder'))}
          textInputProps={textInputProps}
          currentLocationLabel={I18n.t(ext('locationScreenUseCurrentLocation'))}
          fetchDetails
          currentLocation
          onPress={handlePlacePress}
          enablePoweredByContainer={false}
          listUnderlayColor="transparent"
          suppressDefaultStyles
          query={googlePlacesQuery}
          renderRow={renderItem}
          renderRightButton={renderClearButton}
          styles={style.autocompleteStyles}
        />
      </View>
      <ConfirmationModal
        onCancel={() => setErrorModalActive(false)}
        cancelButtonText={I18n.t(ext('locationScreenInvalidAddressButton'))}
        visible={errorModalActive}
        description={error}
      />
    </View>
  );
}

SelectLocationScreen.propTypes = {
  navigation: PropTypes.object.isRequired,
  route: PropTypes.shape({
    params: PropTypes.shape({
      onLocationSelected: PropTypes.func.isRequired,
    }),
  }).isRequired,
  style: PropTypes.object,
};

SelectLocationScreen.defaultProps = {
  style: {},
};

export default connectStyle(ext('SelectLocationScreen'))(SelectLocationScreen);
