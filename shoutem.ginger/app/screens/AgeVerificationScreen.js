import React, { useCallback, useEffect, useLayoutEffect } from 'react';
import RNExitApp from 'react-native-exit-app';
import { useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { connectStyle } from '@shoutem/theme';
import { Button, Image, Text, Title, View } from '@shoutem/ui';
import { I18n } from 'shoutem.i18n';
import { navigateTo } from 'shoutem.navigation';
import { images } from '../assets';
import {
  AgeVerificationSubtitle,
  ImageBackgroundContainer,
} from '../components';
import { ext } from '../const';
import { setVerificationCompleted } from '../redux';

function AgeVerificationScreen({
  navigation,
  route: {
    params: { onContinuePress },
  },
  style,
}) {
  const dispatch = useDispatch();

  useLayoutEffect(() => {
    navigation.setOptions({
      title: '',
      headerLeft: () => null,
    });
  }, [navigation]);

  useEffect(() => {
    navigation.addListener('beforeRemove', e => {
      e.preventDefault();
    });
  }, [navigation]);

  const handleContinuePress = useCallback(() => {
    dispatch(setVerificationCompleted({ callback: onContinuePress }));
  }, [dispatch, onContinuePress]);

  function handlePrivacyPolicyPress() {
    return navigateTo(ext('PrivacyPolicyScreen'));
  }

  function handleTermsOfServicePress() {
    return navigateTo(ext('TermsOfServiceScreen'));
  }

  return (
    <ImageBackgroundContainer src={images.backgroundImage}>
      <View style={style.container}>
        <View styleName="flexible vertical h-center" style={style.mainContent}>
          <Image source={images.age} />
          <Title style={style.title}>
            {I18n.t(ext('ageVerificationTitle'))}
          </Title>
          <AgeVerificationSubtitle
            onPrivacyPolicyPress={handlePrivacyPolicyPress}
            onTermsOfServicePress={handleTermsOfServicePress}
          />
        </View>
        <View style={style.buttonContainer}>
          <Button style={style.confirmButton} onPress={handleContinuePress}>
            <Text>{I18n.t(ext('continueButtonTitle'))}</Text>
          </Button>
          <Button
            styleName="secondary"
            style={style.exitButton}
            onPress={RNExitApp.exitApp}
          >
            <Text>{I18n.t(ext('exitTheAppButtonTitle'))}</Text>
          </Button>
        </View>
      </View>
    </ImageBackgroundContainer>
  );
}

AgeVerificationScreen.propTypes = {
  navigation: PropTypes.object.isRequired,
  route: PropTypes.shape({
    params: PropTypes.shape({
      onContinuePress: PropTypes.func.isRequired,
    }),
  }).isRequired,
  style: PropTypes.object,
};

AgeVerificationScreen.defaultProps = {
  style: {},
};

export default connectStyle(ext('AgeVerificationScreen'))(
  AgeVerificationScreen,
);
