import React, { useLayoutEffect, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import isEmail from 'is-email';
import PropTypes from 'prop-types';
import { connectStyle } from '@shoutem/theme';
import { Subtitle, Title, View } from '@shoutem/ui';
import { sendVerificationCodeEmail } from 'shoutem.auth/redux';
import { I18n } from 'shoutem.i18n';
import {
  composeNavigationStyles,
  HeaderBackButton,
  navigateTo,
} from 'shoutem.navigation';
import { images } from '../assets';
import {
  FormInput,
  ImageBackgroundContainer,
  KeyboardAwareContainer,
  LoadingButton,
} from '../components';
import { ext } from '../const';

function ForgotPasswordScreen({ navigation, style }) {
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [error, setError] = useState(false);

  const defaultNavigationStyle = useMemo(
    () => composeNavigationStyles(['clear']),
    [],
  );

  useLayoutEffect(
    () =>
      navigation.setOptions({
        ...defaultNavigationStyle,
        title: I18n.t(ext('passwordRecoveryNavBarTitle')).toUpperCase(),
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
      style.headerBackButton,
      style.headerTitle,
    ],
  );

  function handleEmailChange(value) {
    setError(false);
    setEmail(value);
  }

  function handleSendEmailPress() {
    setLoading(true);

    if (!isEmail(email)) {
      setLoading(false);
      return setError(I18n.t(ext('invalidEmailFormatErrorMessage')));
    }

    return dispatch(sendVerificationCodeEmail(email))
      .then(() => navigateTo(ext('ChangePasswordScreen'), { email }))
      .finally(() => setLoading(false));
  }

  return (
    <ImageBackgroundContainer src={images.backgroundImage}>
      <View style={style.titleContainer}>
        <Title style={style.title}>{I18n.t(ext('changePasswordTitle'))}</Title>
        <Subtitle style={style.subtitle}>
          {I18n.t(ext('passwordRecoveryDescription'))}
        </Subtitle>
      </View>
      <KeyboardAwareContainer
        renderFooter={() => (
          <LoadingButton
            containerStyle={style.confirmButton}
            disabled={!!error}
            onPress={handleSendEmailPress}
            loading={loading}
            label={I18n.t(ext('sendEmailButtonText'))}
          />
        )}
      >
        <View style={style.inputContainer}>
          <FormInput
            autoFocus
            label={I18n.t(ext('emailLabel'))}
            hasError={!!error}
            errorMessage={error}
            value={email}
            onChangeText={handleEmailChange}
            keyboardType="email-address"
            placeholder={I18n.t(ext('emailPlaceholder'))}
            textContentType="emailAddress"
          />
        </View>
      </KeyboardAwareContainer>
    </ImageBackgroundContainer>
  );
}

ForgotPasswordScreen.propTypes = {
  navigation: PropTypes.object.isRequired,
  style: PropTypes.object,
};

ForgotPasswordScreen.defaultProps = {
  style: {},
};

export default connectStyle(ext('ForgotPasswordScreen'))(ForgotPasswordScreen);
