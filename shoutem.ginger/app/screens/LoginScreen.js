import React, { useCallback, useLayoutEffect, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { connectStyle } from '@shoutem/theme';
import { Button, Text, View } from '@shoutem/ui';
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
import { loginUser } from '../redux';

function LoginScreen({
  navigation,
  route: {
    params: { canGoBack, onLoginSuccess, onCancel, showSkipButton = false },
  },
  style,
}) {
  const dispatch = useDispatch();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(
    I18n.t(ext('alertTryAgainMessage')),
  );
  const [showErrorModal, setShowErrorModal] = useState(false);

  const defaultNavigationStyle = useMemo(
    () => composeNavigationStyles(['clear']),
    [],
  );

  useLayoutEffect(
    () =>
      navigation.setOptions({
        ...defaultNavigationStyle,
        title: I18n.t(ext('loginLabel')),
        headerTitleStyle: {
          ...defaultNavigationStyle.headerTitleStyle,
          ...style.headerTitle,
        },
        headerLeft: props =>
          canGoBack ? (
            <HeaderBackButton
              {...props}
              onPress={onCancel}
              tintColor={style.headerBackButton}
            />
          ) : null,
        headerRight: () =>
          showSkipButton ? (
            <Text style={style.skipButton} onPress={onCancel}>
              Skip
            </Text>
          ) : null,
      }),
    [
      canGoBack,
      defaultNavigationStyle,
      navigation,
      onCancel,
      showSkipButton,
      style.skipButton,
      style.headerBackButton,
      style.headerTitle,
    ],
  );

  const submitDisabled = _.isEmpty(username) || _.isEmpty(password) || loading;

  const handleError = useCallback(e => {
    if (e && _.isString(e)) {
      setErrorMessage(e);
    }
    setShowErrorModal(true);
  }, []);

  const handleRegisterPress = useCallback(
    () =>
      navigateTo(ext('RegisterScreen'), {
        canGoBack,
        onRegisterSuccess: onLoginSuccess,
        onCancel,
      }),
    [canGoBack, onLoginSuccess, onCancel],
  );

  const handleForgotPasswordPress = useCallback(() => {
    navigateTo(ext('ForgotPasswordScreen'));
  }, []);

  function handleLogin() {
    setLoading(true);

    return dispatch(loginUser(username, password, onLoginSuccess))
      .catch(e => handleError(e))
      .finally(() => setLoading(false));
  }

  return (
    <ImageBackgroundContainer src={images.backgroundImage}>
      <KeyboardAwareContainer>
        <FormInput
          label={I18n.t(ext('usernameLabel'))}
          value={username}
          onChangeText={setUsername}
          placeholder={I18n.t(ext('emailPlaceholder'))}
        />
        <FormInput
          label={I18n.t(ext('passwordLabel'))}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          textContentType="newPassword"
          renderAdditionalButton={() => (
            <Button styleName="clear" onPress={handleForgotPasswordPress}>
              <Text style={style.forgotPasswordButton}>
                {I18n.t(ext('forgotPasswordText'))}
              </Text>
            </Button>
          )}
        />
        <LoadingButton
          containerStyle={style.button}
          disabled={submitDisabled}
          onPress={handleLogin}
          loading={loading}
          label={I18n.t(ext('loginLabel'))}
        />
        <View styleName="h-center horizontal">
          <View styleName="flexible" style={style.divider} />
          <Text style={style.orLabel}>{I18n.t(ext('orLabel'))}</Text>
          <View styleName="flexible" style={style.divider} />
        </View>
        <Button
          onPress={handleRegisterPress}
          styleName="secondary md-gutter"
          style={style.button}
        >
          <Text style={style.buttonText}>{I18n.t(ext('registerLabel'))}</Text>
        </Button>
      </KeyboardAwareContainer>
      <ConfirmationModal
        visible={showErrorModal}
        description={errorMessage}
        onCancel={() => setShowErrorModal(false)}
      />
    </ImageBackgroundContainer>
  );
}

LoginScreen.propTypes = {
  navigation: PropTypes.object.isRequired,
  route: PropTypes.shape({
    params: PropTypes.shape({
      canGoBack: PropTypes.bool.isRequired,
      onCancel: PropTypes.func.isRequired,
      onLoginSuccess: PropTypes.func.isRequired,
      showSkipButton: PropTypes.bool,
    }),
  }).isRequired,
  style: PropTypes.object,
};

LoginScreen.defaultProps = {
  style: {},
};

export default connectStyle(ext('LoginScreen'))(LoginScreen);
