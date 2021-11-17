import React, { PureComponent } from 'react';
import { PropTypes } from 'prop-types';
import { connect } from 'react-redux';
import { connectStyle } from '@shoutem/theme';
import { Image, Text, View } from '@shoutem/ui';
import { getExtensionSettings } from 'shoutem.application';
import { I18n } from 'shoutem.i18n';
import LoginButton from '../fragments/LoginButton';
import { ext } from '../const';

export class LoginScreen extends PureComponent {
  static propTypes = {
    imageUrl: PropTypes.string,
  };

  render() {
    const { imageUrl } = this.props;

    return (
      <View styleName="flexible vertical h-center lg-gutter-bottom">
        {!!imageUrl && (
          <Image
            source={{ uri: imageUrl }}
            styleName="medium-square lg-gutter-vertical"
          />
        )}
        <Text styleName="lg-gutter-vertical">
          {I18n.t(ext('loginScreenExplanation'))}
        </Text>
        <LoginButton showIcon={false} />
      </View>
    );
  }
}

export function mapStateToProps(state) {
  const settings = getExtensionSettings(state, ext());
  const { imageUrl } = settings;

  return {
    imageUrl,
  };
}

export default connect(mapStateToProps)(
  connectStyle(ext('LoginScreen'))(LoginScreen),
);
