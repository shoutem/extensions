import React from 'react';
import { Alert, Linking } from 'react-native';
import PropTypes from 'prop-types';
import { connectStyle } from '@shoutem/theme';
import { Button, Icon, Text } from '@shoutem/ui';
import { I18n } from 'shoutem.i18n';
import { ext } from '../const';

function LinkButton({ icon, openURL, url, title }) {
  function handlePress() {
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
  }

  if (!url) {
    return null;
  }

  return (
    <Button styleName="stacked clear tight" onPress={handlePress}>
      <Icon name={icon} />
      <Text>{title}</Text>
    </Button>
  );
}

LinkButton.propTypes = {
  icon: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
  openURL: PropTypes.func,
  title: PropTypes.string,
};

LinkButton.defaultProps = {
  openURL: undefined,
  title: undefined,
};

export default connectStyle(ext('LinkButton'))(LinkButton);
