import React, { useCallback, useLayoutEffect, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import _ from 'lodash';
import moment from 'moment';
import PropTypes from 'prop-types';
import { connectStyle } from '@shoutem/theme';
import { Text, View } from '@shoutem/ui';
import { checkUsernameAvailability } from 'shoutem.auth';
import { I18n } from 'shoutem.i18n';
import {
  composeNavigationStyles,
  goBack,
  HeaderBackButton,
  navigateTo,
} from 'shoutem.navigation';
import { images } from '../assets';
import {
  ConfirmationModal,
  DatePicker,
  FormInput,
  FormInputButton,
  ImageBackgroundContainer,
  KeyboardAwareContainer,
  LoadingButton,
} from '../components';
import { ext } from '../const';
import {
  registerUser,
  sendVerificationCode,
  setCustomerProfile,
} from '../redux';
import {
  DATE_LABEL_FORMAT,
  DATE_VALUE_FORMAT,
  validateField,
  validateFields,
} from '../services';

function RegisterScreen({
  route: {
    params: { canGoBack, onRegisterSuccess, onCancel },
  },
  navigation,
  style,
}) {
  const dispatch = useDispatch();

  const [phoneNumber, setPhoneNumber] = useState('');
  const [nick, setNick] = useState('');
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState();
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [address, setAddress] = useState('');
  const [location, setLocation] = useState();
  const [dob, setDob] = useState(
    moment()
      .subtract(21, 'years')
      .toDate(),
  );
  const [dobLabel, setDobLabel] = useState(
    moment()
      .subtract(21, 'years')
      .format(DATE_LABEL_FORMAT),
  );
  const [googlePlaceId, setGooglePlaceId] = useState();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(
    I18n.t(ext('alertTryAgainMessage')),
  );
  const [showErrorModal, setShowErrorModal] = useState(false);

  const hideErrorModal = useCallback(() => setShowErrorModal(false), []);

  const defaultNavigationStyle = useMemo(
    () => composeNavigationStyles(['clear']),
    [],
  );

  useLayoutEffect(
    () =>
      navigation.setOptions({
        ...defaultNavigationStyle,
        title: I18n.t(ext('registerLabel')),
        headerTitleStyle: {
          ...defaultNavigationStyle.headerTitleStyle,
          ...style.headerTitle,
        },
        headerLeft: props => (
          <HeaderBackButton
            {...props}
            onPress={onCancel}
            tintColor={style.headerBackButton}
          />
        ),
      }),
    [
      canGoBack,
      defaultNavigationStyle,
      navigation,
      onCancel,
      style.headerTitle,
      style.headerBackButton,
    ],
  );

  const submitDisabled =
    loading ||
    !!emailError ||
    !validateFields({
      phoneNumber,
      nick,
      email,
      password,
      firstName,
      lastName,
      address,
      dobLabel,
    });

  const handleDobChanged = useCallback(date => {
    setDob(moment(date).toDate());
    setDobLabel(moment(date).format(DATE_LABEL_FORMAT));
  }, []);

  const handleLoginPress = useCallback(
    () => navigateTo(ext('LoginScreen')),
    [],
  );

  const handlePhoneNumberFocused = useCallback(() => {
    if (_.isEmpty(phoneNumber)) {
      setPhoneNumber('+1');
    }
  }, [phoneNumber]);

  const handleAddressSelected = useCallback(data => {
    goBack();
    setAddress(data.address);
    setGooglePlaceId(data.googlePlaceId);
    setLocation(data.location);
  }, []);

  const handleAddressPress = useCallback(
    () =>
      navigateTo(ext('SelectLocationScreen'), {
        onLocationSelected: handleAddressSelected,
      }),
    [handleAddressSelected],
  );

  const handleError = useCallback(e => {
    if (e && _.isString(e)) {
      setErrorMessage(e);
    }
    setShowErrorModal(true);
  }, []);

  function handleVerificationSuccess(customer) {
    dispatch(registerUser(customer, onRegisterSuccess)).catch(e =>
      handleError(e),
    );
  }

  async function handleSubmit() {
    setLoading(true);

    try {
      const response = await dispatch(checkUsernameAvailability(email));
      const available = _.get(
        response,
        'payload.data.attributes.available',
        false,
      );

      if (!available) {
        setLoading(false);
        return setEmailError(I18n.t(ext('emailTakenErrorMessage')));
      }
    } catch (e) {
      setLoading(false);
      setShowErrorModal(true);
    }

    dispatch(
      setCustomerProfile({
        phoneNumber,
        nick,
        email,
        password,
        firstName,
        lastName,
        address,
        dob: moment(dob).format(DATE_VALUE_FORMAT),
        googlePlaceId,
        location,
      }),
    );

    return dispatch(sendVerificationCode(phoneNumber))
      .then(() =>
        navigateTo(ext('PhoneVerificationScreen'), {
          onVerificationSuccess: handleVerificationSuccess,
        }),
      )
      .catch(e => handleError(e))
      .finally(() => setLoading(false));
  }

  const validatePhoneNumber = () => validateField('phoneNumber', phoneNumber);
  const validatePassword = () => validateField('password', password);
  const validateFirstName = () => validateField('firstName', firstName);
  const validateLastName = () => validateField('lastName', lastName);
  const validateEmail = () => validateField('email', email);
  const validateNick = () => validateField('nick', nick);

  const resolvedEmailError = !_.isEmpty(emailError)
    ? emailError
    : I18n.t(ext('emailErrorMessage'));

  function handleEmailChanged(value) {
    setEmailError(null);
    setEmail(value);
  }

  return (
    <ImageBackgroundContainer src={images.backgroundImage}>
      <KeyboardAwareContainer>
        <FormInput
          label={I18n.t(ext('phoneNumberLabel'))}
          value={phoneNumber}
          errorMessage={I18n.t(ext('phoneNumberErrorMessage'))}
          onChangeText={setPhoneNumber}
          onFocus={handlePhoneNumberFocused}
          placeholder={I18n.t(ext('phoneNumberPlaceholder'))}
          keyboardType="phone-pad"
          textContentType="telephoneNumber"
          validateInput={validatePhoneNumber}
        />
        <FormInput
          label={I18n.t(ext('nickLabel'))}
          value={nick}
          errorMessage={I18n.t(ext('nickErrorMessage'))}
          onChangeText={setNick}
          validateInput={validateNick}
        />
        <FormInput
          label={I18n.t(ext('emailLabel'))}
          value={email}
          hasError={!!emailError}
          errorMessage={resolvedEmailError}
          onChangeText={handleEmailChanged}
          placeholder={I18n.t(ext('emailPlaceholder'))}
          keyboardType="email-address"
          textContentType="emailAddress"
          validateInput={validateEmail}
        />
        <FormInput
          label={I18n.t(ext('passwordLabel'))}
          value={password}
          errorMessage={I18n.t(ext('passwordErrorMessage'))}
          onChangeText={setPassword}
          secureTextEntry
          validateInput={validatePassword}
        />
        <FormInput
          label={I18n.t(ext('firstNameLabel'))}
          value={firstName}
          errorMessage={I18n.t(ext('nameErrorMessage'))}
          onChangeText={setFirstName}
          textContentType="name"
          validateInput={validateFirstName}
        />
        <FormInput
          label={I18n.t(ext('lastNameLabel'))}
          value={lastName}
          errorMessage={I18n.t(ext('nameErrorMessage'))}
          onChangeText={setLastName}
          validateInput={validateLastName}
        />
        <FormInputButton
          onPress={handleAddressPress}
          value={address}
          label={I18n.t(ext('addressLabel'))}
        />
        <DatePicker
          label={I18n.t(ext('dobLabel'))}
          value={dob}
          textValue={dobLabel}
          onValueChanged={handleDobChanged}
        />
        <LoadingButton
          containerStyle={style.button}
          disabled={submitDisabled}
          label={I18n.t(ext('submitLabel'))}
          loading={loading}
          onPress={handleSubmit}
        />
        <View styleName="horizontal h-center md-gutter-vertical">
          <Text style={style.existingAccountLabel}>
            {I18n.t(ext('alreadyHaveAnAccountLabel'))}
          </Text>
          <Text style={style.loginLabel} onPress={handleLoginPress}>
            {I18n.t(ext('loginLabel'))}
          </Text>
        </View>
      </KeyboardAwareContainer>
      {showErrorModal && (
        <ConfirmationModal
          visible={showErrorModal}
          description={errorMessage}
          onCancel={hideErrorModal}
        />
      )}
    </ImageBackgroundContainer>
  );
}

RegisterScreen.propTypes = {
  navigation: PropTypes.object.isRequired,
  route: PropTypes.shape({
    params: PropTypes.shape({
      canGoBack: PropTypes.bool.isRequired,
      onCancel: PropTypes.func.isRequired,
      onRegisterSuccess: PropTypes.func.isRequired,
    }),
  }).isRequired,
  style: PropTypes.object,
};

RegisterScreen.defaultProps = {
  style: {},
};

export default connectStyle(ext('RegisterScreen'))(RegisterScreen);
