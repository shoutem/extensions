import React, { PureComponent } from 'react';
import autoBindReact from 'auto-bind/react';
import PropTypes from 'prop-types';
import { connectStyle } from '@shoutem/theme';
import { Button, Icon, TextInput, View } from '@shoutem/ui';
import { I18n } from 'shoutem.i18n';
import { ext } from '../const';

class PasswordTextInput extends PureComponent {
  constructor(props) {
    super(props);

    autoBindReact(this);

    this.state = {
      visibility: false,
    };
  }

  handleVisibilityChange() {
    const { visibility } = this.state;
    this.setState({ visibility: !visibility });
  }

  render() {
    const { errorMessage, onChangeText, password, animate, style } = this.props;
    const { visibility } = this.state;

    return (
      <View>
        <TextInput
          animate={animate}
          autoCapitalize="none"
          autoCorrect={false}
          errorMessage={errorMessage}
          highlightOnFocus
          keyboardAppearance="dark"
          onChangeText={onChangeText}
          placeholder={I18n.t(ext('passwordPlaceholder'))}
          returnKeyType="done"
          secureTextEntry={!visibility}
          value={password}
        />
        <Button
          onPress={this.handleVisibilityChange}
          styleName="clear sm-gutter-horizontal"
        >
          <Icon
            name={visibility ? 'eye' : 'eye-crossed'}
            fill={style.iconColor}
          />
        </Button>
      </View>
    );
  }
}

PasswordTextInput.propTypes = {
  style: PropTypes.object.isRequired,
  animate: PropTypes.bool,
  errorMessage: PropTypes.string,
  password: PropTypes.string,
  onChangeText: PropTypes.func,
};

PasswordTextInput.defaultProps = {
  animate: undefined,
  errorMessage: undefined,
  password: undefined,
  onChangeText: undefined,
};

export default connectStyle(ext('PasswordTextInput'))(PasswordTextInput);
