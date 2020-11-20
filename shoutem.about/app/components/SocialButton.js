import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import autoBindReact from 'auto-bind/react';
import { Linking, Alert } from 'react-native';

import { Button, Icon, Text } from '@shoutem/ui';

import { I18n } from 'shoutem.i18n';

export default class SocialButton extends PureComponent {
  static propTypes = {
    url: PropTypes.string,
    title: PropTypes.string,
    icon: PropTypes.string.isRequired,
    openURL: PropTypes.func,
  }

  constructor(props) {
    super(props);

    autoBindReact(this);
  }

  buttonPressHandle() {
    const { icon, openURL, url, title } = this.props;

    if (icon === 'call' || icon === 'email') {
      Linking.canOpenURL(url).then((supported) => {
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

  render() {
    const { icon, title, url } = this.props;

    if (!url) {
      return null;
    }

    return (
      <Button styleName="stacked clear tight" onPress={this.buttonPressHandle}>
        <Icon name={icon} />
        <Text>{title}</Text>
      </Button>
    );
  }
}
