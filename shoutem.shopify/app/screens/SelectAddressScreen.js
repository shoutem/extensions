import React, { useCallback, useLayoutEffect, useMemo, useRef } from 'react';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { connectStyle } from '@shoutem/theme';
import { Icon, Screen, Touchable } from '@shoutem/ui';
import { currentLocation } from 'shoutem.cms';
import { I18n } from 'shoutem.i18n';
import { ext } from '../const';
import { getShopifyGooglePlacesApiKey } from '../redux/selectors';

function SelectAddressScreen({
  navigation,
  style,
  route: {
    params: { onAddressSelected },
  },
  checkPermissionStatus,
}) {
  const inputRef = useRef();

  const apiKey = useSelector(getShopifyGooglePlacesApiKey);
  const googlePlacesQuery = useMemo(
    () => ({
      key: apiKey,
      language: 'en',
    }),
    [apiKey],
  );

  useLayoutEffect(() => {
    navigation.setOptions({
      title: I18n.t(ext('selectAddressNavBarTitle')),
    });
    checkPermissionStatus();
  }, [navigation, checkPermissionStatus]);

  const clearInput = useCallback(() => {
    inputRef.current?.setAddressText('');

    return inputRef.current?.clear();
  }, [inputRef]);

  const renderClearButton = useCallback(
    () => (
      <Touchable style={style.closeIconContainer} onPress={clearInput}>
        <Icon name="close" style={style.closeIcon} />
      </Touchable>
    ),
    [style.closeIconContainer, style.closeIcon, clearInput],
  );

  const textInputProps = useMemo(
    () => ({
      autoFocus: true,
      clearButtonMode: 'never',
      ...style.placeholderText,
    }),
    [style],
  );

  return (
    <Screen>
      <GooglePlacesAutocomplete
        ref={inputRef}
        placeholder={I18n.t(ext('addressSearchPlaceholder'))}
        textInputProps={textInputProps}
        currentLocationLabel={I18n.t(ext('addressSearchCurrentLocation'))}
        currentLocation={false}
        onPress={onAddressSelected}
        enablePoweredByContainer={false}
        query={googlePlacesQuery}
        renderRightButton={renderClearButton}
        styles={style.autocompleteStyles}
        fetchDetails
      />
    </Screen>
  );
}

SelectAddressScreen.propTypes = {
  checkPermissionStatus: PropTypes.func.isRequired,
  navigation: PropTypes.object.isRequired,
  route: PropTypes.shape({
    params: PropTypes.shape({
      onAddressSelected: PropTypes.func.isRequired,
    }),
  }).isRequired,
  style: PropTypes.object,
};

SelectAddressScreen.defaultProps = {
  style: {},
};

export default connectStyle(ext('SelectAddressScreen'))(
  currentLocation(SelectAddressScreen),
);
