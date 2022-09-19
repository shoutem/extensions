import React, { useCallback, useEffect, useLayoutEffect } from 'react';
import RNExitApp from 'react-native-exit-app';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { connectStyle } from '@shoutem/theme';
import { Button, Text, Title, View } from '@shoutem/ui';
import { getExtensionSettings } from 'shoutem.application';
import { I18n } from 'shoutem.i18n';
import { openURL } from 'shoutem.web-view';
import {
  AgeBadge,
  AgeRestrictionSubtitle,
  ImageBackgroundContainer,
} from '../components';
import { ext } from '../const';
import { getBackgroundImage, setVerificationCompleted } from '../redux';

function AgeRestrictionScreen({
  navigation,
  route: {
    params: { onContinuePress },
  },
  style,
}) {
  const dispatch = useDispatch();
  const imageBackground = useSelector(getBackgroundImage);

  const { requiredAge, termsOfService, privacyPolicy } = useSelector(state =>
    getExtensionSettings(state, ext()),
  );

  useLayoutEffect(() => {
    navigation.setOptions({
      title: '',
      headerLeft: () => null,
    });
  }, [navigation]);

  useEffect(() => {
    const navigationRemoveListener = navigation.addListener(
      'beforeRemove',
      e => {
        e.preventDefault();
      },
    );

    return navigationRemoveListener;
  }, [navigation]);

  const handleContinuePress = useCallback(() => {
    dispatch(setVerificationCompleted(true));
    onContinuePress();
  }, [dispatch, onContinuePress]);

  function handlePrivacyPolicyPress() {
    return openURL(
      privacyPolicy,
      I18n.t(ext('privacyPolicyNavBarTitle')),
      true,
      false,
      {},
      {},
      {
        showSharing: false,
      },
    );
  }

  function handleTermsOfServicePress() {
    return openURL(
      termsOfService,
      I18n.t(ext('termsOfServiceNavBarTitle')),
      true,
      false,
      {},
      {},
      {
        showSharing: false,
      },
    );
  }

  return (
    <ImageBackgroundContainer src={imageBackground}>
      <View style={style.container}>
        <View style={style.mainContent}>
          <AgeBadge age={requiredAge} />
          <Title style={style.title}>
            {I18n.t(ext('ageRestrictionTitle'), { requiredAge })}
          </Title>
          <AgeRestrictionSubtitle
            onPrivacyPolicyPress={handlePrivacyPolicyPress}
            onTermsOfServicePress={handleTermsOfServicePress}
          />
        </View>
        <View style={style.buttonContainer}>
          <Button style={style.confirmButton} onPress={handleContinuePress}>
            <Text style={style.confirmButtonText}>
              {I18n.t(ext('continueButtonTitle'))}
            </Text>
          </Button>
          <Button style={style.exitButton} onPress={RNExitApp.exitApp}>
            <Text style={style.exitButtonText}>
              {I18n.t(ext('exitTheAppButtonTitle'))}
            </Text>
          </Button>
        </View>
      </View>
    </ImageBackgroundContainer>
  );
}

AgeRestrictionScreen.propTypes = {
  navigation: PropTypes.object.isRequired,
  route: PropTypes.shape({
    params: PropTypes.shape({
      onContinuePress: PropTypes.func.isRequired,
    }),
  }).isRequired,
  style: PropTypes.object,
};

AgeRestrictionScreen.defaultProps = {
  style: {},
};

export default connectStyle(ext('AgeRestrictionScreen'))(AgeRestrictionScreen);
