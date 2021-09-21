import React from 'react';
import PropTypes from 'prop-types';
import { Linking, Alert } from 'react-native';
import { I18n } from 'shoutem.i18n';
import { Button, Icon, Text } from '@shoutem/ui';

const SocialButton = ({ icon, openURL, url, title }) => {
  const buttonPressHandle = () => {
    if (icon === 'call' || icon === 'email') {
      Linking.canOpenURL(url).then(supported => {
        if (supported) {
          Linking.openURL(url);
        } else {
          Alert.alert(
            I18n.t('shoutem.application.errorTitle'),
            I18n.t('shoutem.application.preview.unsupportedActionMessage'),
            [{ text: 'OK', onPress: () => {} }],
          );
        }
      });
      return;
    }

    openURL(url, title);
  };

  if (!url) {
    return null;
  }

  return (
    <Button styleName="stacked clear tight" onPress={buttonPressHandle}>
      <Icon name={icon} />
      <Text>{title}</Text>
    </Button>
  );
};

SocialButton.propTypes = {
  url: PropTypes.string,
  title: PropTypes.string,
  icon: PropTypes.string.isRequired,
  openURL: PropTypes.func,
};

export default SocialButton;
