import React, { useLayoutEffect, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { connectStyle } from '@shoutem/theme';
import { Subtitle, Title, View } from '@shoutem/ui';
import { resetPassword } from 'shoutem.auth';
import { I18n } from 'shoutem.i18n';
import {
  composeNavigationStyles,
  HeaderBackButton,
  navigateTo,
} from 'shoutem.navigation';
import { images } from '../assets';
import {
  ConfirmationModal,
  FormInput,
  ImageBackgroundContainer,
  KeyboardAwareContainer,
  LoadingButton,
} from '../components';
import { ext } from '../const';

function ChangePasswordScreen({
  navigation,
  route: {
    params: { email },
  },
  style,
}) {
  const dispatch = useDispatch();

  const [verificationCode, setVerificationCode] = useState('');
  const [verificationCodeError, setVerificationCodeError] = useState(null);
  const [newPassword, setNewPassword] = useState('');
  const [newPasswordError, setNewPasswordError] = useState(null);
  const [repeatNewPassword, setRepeatNewPassword] = useState('');
  const [repeatNewPasswordError, setRepeatNewPasswordError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [successModalVisible, setSuccessModalVisible] = useState(false);
  const [errorModalVisible, setErrorModalVisible] = useState(false);

  const defaultNavigationStyle = useMemo(
    () => composeNavigationStyles(['clear']),
    [],
  );

  useLayoutEffect(
    () =>
      navigation.setOptions({
        ...defaultNavigationStyle,
        title: I18n.t(ext('changePasswordNavBarTitle')),
        headerTitleStyle: {
          ...defaultNavigationStyle.headerTitleStyle,
          ...style.headerTitle,
        },
        headerLeft: props => (
          <HeaderBackButton {...props} tintColor={style.headerBackButton} />
        ),
      }),
    [
      defaultNavigationStyle,
      navigation,
      style.headerTitle,
      style.headerBackButton,
    ],
  );

  function validateInputValues() {
    let isValid = true;

    if (_.isEmpty(verificationCode)) {
      isValid = false;

      setVerificationCodeError(I18n.t(ext('verificationCodeErrorText')));
    }

    if (newPassword.length < 6) {
      isValid = false;

      setNewPasswordError(I18n.t(ext('passwordFormatErrorMessage')));
    }

    if (newPassword !== repeatNewPassword) {
      isValid = false;

      setRepeatNewPasswordError(I18n.t(ext('repeatPasswordErrorText')));
    }

    return isValid;
  }

  function showResetResultAlert(passwordChangedSuccessfully) {
    if (passwordChangedSuccessfully) {
      setSuccessModalVisible(true);
    }

    return setErrorModalVisible(true);
  }

  function handleChangePasswordPress() {
    setLoading(true);
    setVerificationCodeError(null);
    setNewPasswordError(null);
    setRepeatNewPasswordError(null);

    const validInputs = validateInputValues();

    if (validInputs) {
      return dispatch(resetPassword(verificationCode, email, newPassword))
        .then(() => showResetResultAlert(true))
        .catch(() => showResetResultAlert(false))
        .finally(() => setLoading(false));
    }

    setLoading(false);
    return null;
  }

  const renderFooter = () => (
    <View style={style.buttonContainer}>
      <LoadingButton
        label={I18n.t(ext('confirmButtonText'))}
        loading={loading}
        onPress={handleChangePasswordPress}
      />
    </View>
  );

  return (
    <ImageBackgroundContainer src={images.backgroundImage}>
      <KeyboardAwareContainer renderFooter={renderFooter}>
        <View style={style.titleContainer}>
          <Title style={style.text}>{I18n.t(ext('changePasswordTitle'))}</Title>
          <Subtitle style={style.text}>
            {I18n.t(ext('changePasswordDescription'))}
          </Subtitle>
        </View>
        <View>
          <FormInput
            label={I18n.t(ext('verificationCodeLabel'))}
            placeholder={I18n.t(ext('verificationCodeInputPlaceholder'))}
            autoCapitalize="none"
            hasError={!!verificationCodeError}
            errorMessage={verificationCodeError}
            autoCorrect={false}
            highlightOnFocus
            keyboardAppearance="dark"
            onChangeText={setVerificationCode}
            returnKeyType="done"
            value={verificationCode}
          />
          <FormInput
            label={I18n.t(ext('newPasswordLabel'))}
            placeholder={I18n.t(ext('newPasswordLabel'))}
            value={newPassword}
            hasError={!!newPasswordError}
            errorMessage={newPasswordError}
            onChangeText={setNewPassword}
            secureTextEntry
            textContentType="newPassword"
          />
          <FormInput
            label={I18n.t(ext('repeatNewPasswordLabel'))}
            placeholder={I18n.t(ext('repeatNewPasswordLabel'))}
            value={repeatNewPassword}
            hasError={!!repeatNewPasswordError}
            errorMessage={repeatNewPasswordError}
            onChangeText={setRepeatNewPassword}
            secureTextEntry
            textContentType="newPassword"
          />
        </View>
      </KeyboardAwareContainer>
      {successModalVisible && (
        <ConfirmationModal
          visible={successModalVisible}
          description={I18n.t(ext('alertSuccessMessage'))}
          cancelButtonText={I18n.t(ext('alertConfirmButton'))}
          onCancel={() => navigateTo(ext('LoginScreen'))}
        />
      )}
      {errorModalVisible && (
        <ConfirmationModal
          visible={errorModalVisible}
          description={I18n.t(ext('alertErrorMessage'))}
          cancelButtonText={I18n.t(ext('alertConfirmButton'))}
          onCancel={() => setErrorModalVisible(false)}
        />
      )}
    </ImageBackgroundContainer>
  );
}

ChangePasswordScreen.propTypes = {
  navigation: PropTypes.object.isRequired,
  route: PropTypes.shape({
    params: PropTypes.shape({
      email: PropTypes.string.isRequired,
    }),
  }).isRequired,
  style: PropTypes.object,
};

ChangePasswordScreen.defaultProps = {
  style: {},
};

export default connectStyle(ext('ChangePasswordScreen'))(ChangePasswordScreen);
