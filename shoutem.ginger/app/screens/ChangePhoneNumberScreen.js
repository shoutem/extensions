import React, { useLayoutEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { connectStyle } from '@shoutem/theme';
import { Icon, Title, View } from '@shoutem/ui';
import { I18n } from 'shoutem.i18n';
import { goBack, HeaderBackButton } from 'shoutem.navigation';
import { images } from '../assets';
import {
  FormInput,
  ImageBackgroundContainer,
  KeyboardAwareContainer,
  LoadingButton,
} from '../components';
import { ext } from '../const';
import { sendVerificationCode, setCustomerProfile } from '../redux';

function ChangePhoneNumberScreen({ navigation, style }) {
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);

  useLayoutEffect(
    () =>
      navigation.setOptions({
        title: null,
        headerLeft: () => <HeaderBackButton onPress={goBack} />,
      }),
    [navigation],
  );

  const [phoneNumber, setPhoneNumber] = useState('');

  function handleSendCodePress() {
    setLoading(true);

    dispatch(setCustomerProfile({ phoneNumber }));
    dispatch(sendVerificationCode(phoneNumber)).then(() => {
      setLoading(false);
      goBack();
    });
  }

  function renderFooterButton() {
    return (
      <LoadingButton
        containerStyle={style.button}
        label={I18n.t(ext('sendVerificationCode'))}
        loading={loading}
        onPress={handleSendCodePress}
      />
    );
  }

  return (
    <ImageBackgroundContainer src={images.backgroundImage}>
      <KeyboardAwareContainer renderFooter={renderFooterButton}>
        <View styleName="flexible vertical h-center">
          <Icon name="ginger-phone" style={style.phoneIcon} />
          <Title style={style.title}>{I18n.t(ext('whatIsYourNumber'))}</Title>
          <View styleName="md-gutter-top" style={style.input}>
            <FormInput
              autoFocus
              label={I18n.t(ext('phoneNumberLabel'))}
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              keyboardType="phone-pad"
              textContentType="telephoneNumber"
            />
          </View>
        </View>
      </KeyboardAwareContainer>
    </ImageBackgroundContainer>
  );
}

ChangePhoneNumberScreen.propTypes = {
  navigation: PropTypes.object.isRequired,
  style: PropTypes.object,
};

ChangePhoneNumberScreen.defaultProps = {
  style: {},
};

export default connectStyle(ext('ChangePhoneNumberScreen'))(
  ChangePhoneNumberScreen,
);
