import React, { useCallback, useLayoutEffect, useMemo, useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { connectStyle } from '@shoutem/theme';
import {
  Button,
  DropDownMenu,
  FormGroup,
  Icon,
  Keyboard,
  ScrollView,
  Spinner,
  Text,
  Toast,
  View,
} from '@shoutem/ui';
import { I18n } from 'shoutem.i18n';
import { goBack, HeaderIconButton, navigateTo } from 'shoutem.navigation';
import { FormInput } from '../components';
import { ext } from '../const';
import { actions, selectors } from '../redux';
import { formatAutocompleteData, isPhoneValid } from '../services';
import { countries } from '../services/countries';

const KEYBOARD_AVOIDING_BEHAVIOUR =
  Platform.OS === 'android' ? 'null' : 'padding';
const KEYBOARD_OFFSET =
  Platform.OS === 'android' ? Keyboard.calculateKeyboardOffset() : 0;
const KEYBOARD_DISMISS_MODE =
  Platform.OS === 'android' ? 'on-drag' : 'interactive';

function EditAddressScreen({ route: { params }, navigation, style }) {
  const { addressId = null, isDefaultAddress = false } = params;

  const canDelete = useMemo(() => addressId && !isDefaultAddress, [
    addressId,
    isDefaultAddress,
  ]);

  const dispatch = useDispatch();
  const loading = useSelector(selectors.getCustomerLoading);
  const address = useSelector(state =>
    selectors.getCustomerAddressById(state, addressId),
  );

  const [firstName, setFirstName] = useState(address?.firstName);
  const [lastName, setLastName] = useState(address?.lastName);
  const [address1, setAddress1] = useState(address?.address1);
  const [city, setCity] = useState(address?.city);
  const [country, setCountry] = useState(address?.country);
  const [countryCode, setCountryCode] = useState(address?.countryCodeV2);
  const [province, setProvince] = useState(address?.province);
  const [zip, setZip] = useState(address?.zip);
  const [phone, setPhone] = useState(address?.phone);
  const [phoneError, setPhoneError] = useState();

  const handleAddressDelete = useCallback(() => {
    dispatch(actions.deleteCustomerAddress(addressId)).then(() => {
      goBack();

      Toast.showSuccess({
        title: I18n.t(ext('addressUpdateTitle')),
        message: I18n.t(ext('addressDeleteSuccess')),
      });
    });
  }, [dispatch, addressId]);

  const handleDeletePress = useCallback(() => {
    Alert.alert(
      I18n.t(ext('deleteAddressWarningTitle')),
      I18n.t(ext('deleteAddressWarningMessage')),
      [
        {
          text: I18n.t(ext('deleteAddressCancel')),
        },
        {
          text: I18n.t(ext('deleteAddressConfirm')),
          style: 'destructive',
          onPress: handleAddressDelete,
        },
      ],
    );
  }, [handleAddressDelete]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: navProps =>
        canDelete ? (
          <HeaderIconButton
            {...navProps}
            iconName="garbage-can"
            onPress={handleDeletePress}
            tintColor={style.deleteIcon}
          />
        ) : null,
    });
  }, [navigation, dispatch, canDelete, style, handleDeletePress]);

  function handleCountrySelected(country) {
    setCountry(country.name);
    setCountryCode(country.cca2);
  }

  function handleAddressSelected(_shortInfo, longInfo) {
    const {
      address,
      postalCode,
      city,
      countryName,
      countryCode,
      province,
    } = formatAutocompleteData(longInfo);

    setAddress1(address);
    setZip(postalCode);
    setCity(city);
    setCountry(countryName);
    setCountryCode(countryCode);
    setProvince(province);

    goBack();
  }

  function handleAddressFieldPress() {
    navigateTo(ext('SelectAddressScreen'), {
      onAddressSelected: handleAddressSelected,
    });
  }

  const handleSuccess = useCallback(() => {
    goBack();

    const message = addressId
      ? I18n.t(ext('addressEditSuccess'))
      : I18n.t(ext('addressCreateSuccess'));

    return Toast.showSuccess({
      title: I18n.t(ext('addressUpdateTitle')),
      message,
    });
  }, [addressId]);

  const handleSetDefaultAddress = useCallback(
    () =>
      dispatch(actions.updateDefaultCustomerAddress(addressId)).then(() =>
        handleSuccess(),
      ),
    [dispatch, addressId, handleSuccess],
  );

  const handleSetAsDefaultPress = useCallback(() => {
    Alert.alert(
      I18n.t(ext('setDefaultAddressWarningTitle')),
      I18n.t(ext('setDefaultAddressWarningMessage')),
      [
        {
          text: I18n.t(ext('setDefaultAddressCancel')),
          style: 'cancel',
        },
        {
          text: I18n.t(ext('setDefaultAddressConfirm')),
          onPress: handleSetDefaultAddress,
        },
      ],
    );
  }, [handleSetDefaultAddress]);

  const handlePhoneChange = useCallback(input => {
    setPhone(input);

    const isValid = isPhoneValid(input);

    if (!isValid) {
      setPhoneError(I18n.t(ext('phoneErrorMessage')));
    } else {
      setPhoneError();
    }
  }, []);

  function handleSubmit() {
    const fields = [
      firstName,
      lastName,
      address1,
      city,
      country,
      countryCode,
      province,
      zip,
      phone,
    ];

    const phoneValid = isPhoneValid(phone);

    if (!phoneValid) {
      return setPhoneError(I18n.t(ext('phoneErrorMessage')));
    }

    if (_.some(fields, _.isEmpty)) {
      return Toast.showError({
        title: I18n.t(ext('addressFormIncompleteTitle')),
        message: I18n.t(ext('addressFormIncompleteMessage')),
      });
    }

    return dispatch(
      actions.updateCustomerAddress(addressId, {
        firstName,
        lastName,
        address1,
        city,
        country,
        countryCode,
        province,
        zip,
        phone,
      }),
    ).then(handleSuccess);
  }

  const selectedCountry = _.find(countries, { cca2: countryCode });

  return (
    <KeyboardAvoidingView
      behavior={KEYBOARD_AVOIDING_BEHAVIOUR}
      keyboardVerticalOffset={KEYBOARD_OFFSET - 5}
      style={style.container}
    >
      {loading && <Spinner style={style.spinner} />}
      <ScrollView keyboardDismissMode={KEYBOARD_DISMISS_MODE}>
        <FormInput
          label={I18n.t(ext('editFirstNameLabel'))}
          value={firstName}
          onChange={setFirstName}
        />
        <FormInput
          label={I18n.t(ext('editLastNameLabel'))}
          value={lastName}
          onChange={setLastName}
        />
        <FormInput
          label={I18n.t(ext('editPhoneLabel'))}
          value={phone}
          placeholder={I18n.t(ext('phonePlaceholder'))}
          error={phoneError}
          onChange={handlePhoneChange}
        />
        <FormInput
          label={I18n.t(ext('editAddressLabel'))}
          value={address1}
          onChange={setAddress1}
          onPress={handleAddressFieldPress}
        />
        <FormInput
          label={I18n.t(ext('editCityLabel'))}
          value={city}
          onChange={setCity}
        />
        <FormGroup style={style.dropDownContainer}>
          <Text style={style.label}>{I18n.t(ext('editCountryLabel'))}</Text>
          <DropDownMenu
            onOptionSelected={handleCountrySelected}
            options={countries}
            selectedOption={selectedCountry || countries[0]}
            style={style.dropDownMenu}
            titleProperty="name"
            valueProperty="cca2"
          />
        </FormGroup>
        <FormInput
          label={I18n.t(ext('editProvinceLabel'))}
          value={province}
          onChange={setProvince}
        />
        <FormInput
          label={I18n.t(ext('editZipLabel'))}
          value={zip}
          onChange={setZip}
        />
        {canDelete && (
          <Button
            style={style.setDefaultAddressButton}
            onPress={handleSetAsDefaultPress}
          >
            <Icon name="pin" />
            <Text>{I18n.t(ext('setAsDefaultAddress'))}</Text>
          </Button>
        )}
      </ScrollView>
      <View style={style.footer}>
        <Button style={style.confirmButton} onPress={handleSubmit}>
          <Text style={style.confirmButtonText}>
            {I18n.t(ext('saveChanges'))}
          </Text>
        </Button>
      </View>
    </KeyboardAvoidingView>
  );
}

EditAddressScreen.propTypes = {
  navigation: PropTypes.object.isRequired,
  route: PropTypes.object.isRequired,
  style: PropTypes.object,
};

EditAddressScreen.defaultProps = {
  style: {},
};

export default connectStyle(ext('EditAddressScreen'))(EditAddressScreen);
