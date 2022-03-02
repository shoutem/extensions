import React, { useCallback, useLayoutEffect, useState } from 'react';
import { Keyboard, Linking } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { connectStyle } from '@shoutem/theme';
import { Icon, Subtitle, Text, Title, View } from '@shoutem/ui';
import { getExtensionSettings } from 'shoutem.application';
import { I18n } from 'shoutem.i18n';
import { HeaderBackButton, navigateTo } from 'shoutem.navigation';
import { images } from '../assets';
import {
  CodeInput,
  ConfirmationModal,
  ImageBackgroundContainer,
  KeyboardAwareContainer,
  LoadingButton,
} from '../components';
import { ext } from '../const';
import { useTimer } from '../hooks';
import {
  completeUserVerification,
  getCustomerProfile,
  sendVerificationCode,
} from '../redux';

function PhoneVerificationScreen({
  navigation,
  route: {
    params: { onVerificationSuccess },
  },
  style,
}) {
  const dispatch = useDispatch();
  const { phoneNumber } = useSelector(getCustomerProfile);
  const { supportEmail } = useSelector(state =>
    getExtensionSettings(state, ext()),
  );

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(
    I18n.t(ext('alertTryAgainMessage')),
  );
  const [showErrorModal, setShowErrorModal] = useState(false);

  useLayoutEffect(
    () =>
      navigation.setOptions({
        title: '',
        headerLeft: props => (
          <HeaderBackButton {...props} tintColor={style.headerBackButton} />
        ),
      }),
    [navigation, style.headerBackButton],
  );

  const [remainingTime, isTimerActive, resetTimer] = useTimer(59);

  const handleChangePhoneNumberPress = useCallback(
    () => navigateTo(ext('ChangePhoneNumberScreen')),
    [],
  );

  const handleSupportEmailPress = useCallback(() => {
    Linking.canOpenURL(`mailto:${supportEmail}`)
      .then(supported => {
        if (supported) {
          Linking.openURL(`mailto:${supportEmail}`);
        }
      })
      .catch(_.noop());
  }, [supportEmail]);

  const handleError = useCallback(e => {
    if (e && _.isString(e)) {
      setErrorMessage(e);
    }
    setShowErrorModal(true);
  }, []);

  const handleResendCodePress = () => {
    if (isTimerActive) {
      return null;
    }

    resetTimer();
    return dispatch(sendVerificationCode(phoneNumber));
  };

  const handleSubmitCodePress = useCallback(
    code => {
      Keyboard.dismiss();
      setLoading(true);

      dispatch(completeUserVerification(phoneNumber, code))
        .then(({ payload: customer }) => onVerificationSuccess(customer))
        .catch(e => handleError(e))
        .finally(() => setLoading(false));
    },
    [dispatch, handleError, onVerificationSuccess, phoneNumber],
  );

  // TODO: Update phone icon
  return (
    <ImageBackgroundContainer src={images.backgroundImage}>
      <KeyboardAwareContainer>
        <View styleName="flexible vertical h-center">
          <Icon name="ginger-phone" style={style.phoneIcon} />
          <Title style={style.text}>{I18n.t(ext('verifyPhoneNumber'))}</Title>
          <Subtitle styleName="md-gutter-top" style={style.text}>
            {I18n.t(ext('codeSentToNumber'), { phoneNumber })}
          </Subtitle>
          <Subtitle
            onPress={handleChangePhoneNumberPress}
            style={style.boldText}
          >
            {I18n.t(ext('changeNumber'))}
          </Subtitle>
          <CodeInput onSubmit={handleSubmitCodePress} />
          <Text style={style.boldText} onPress={handleResendCodePress}>
            {isTimerActive
              ? I18n.t(ext('resendCodeIn'), { time: remainingTime })
              : I18n.t(ext('resendCode'))}
          </Text>
        </View>
      </KeyboardAwareContainer>
      <View styleName="vertical h-center md-gutter-horizontal">
        <Text styleName="h-center lg-gutter-vertical" style={style.text}>
          {I18n.t(ext('codeNotReceived'))}
          <Text style={style.boldText} onPress={handleSupportEmailPress}>
            {supportEmail}
          </Text>
        </Text>
        <LoadingButton
          loading={loading}
          label={I18n.t(ext('verifyYourNumber'))}
          onPress={handleSubmitCodePress}
          containerStyle={style.verifyButton}
        />
      </View>
      {showErrorModal && (
        <ConfirmationModal
          visible={showErrorModal}
          description={errorMessage}
          onCancel={() => setShowErrorModal(false)}
        />
      )}
    </ImageBackgroundContainer>
  );
}

PhoneVerificationScreen.propTypes = {
  navigation: PropTypes.object.isRequired,
  route: PropTypes.shape({
    params: PropTypes.shape({
      onVerificationSuccess: PropTypes.func.isRequired,
    }),
  }).isRequired,
  style: PropTypes.object,
};

PhoneVerificationScreen.defaultProps = {
  style: {},
};

export default connectStyle(ext('PhoneVerificationScreen'))(
  PhoneVerificationScreen,
);
