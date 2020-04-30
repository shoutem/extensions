import React, { PureComponent } from 'react';
import autoBind from 'auto-bind';
import { View, TextInput, Button, Icon } from '@shoutem/ui';
import { connectStyle } from '@shoutem/theme';
import { I18n } from 'shoutem.i18n';
import { ext } from '../const';

class PasswordTextInput extends PureComponent {
  constructor(props) {
    super(props);

    autoBind(this);

    this.state = {
      password: '',
      visibility: false,
    };
  }

  handleVisibilityChange() {
    const { visibility } = this.state;
    this.setState({ visibility: !visibility });
  }

  render() {
    const { password } = this.props;
    const { visibility } = this.state;
    return (
      <View>
        <TextInput
          autoCapitalize="none"
          autoCorrect={false}
          keyboardAppearance="dark"
          onChangeText={this.props.onChangeText}
          placeholder={I18n.t(ext('passwordPlaceholder'))}
          returnKeyType="done"
          secureTextEntry={!visibility}
          value={password}
        />
        <Button onPress={this.handleVisibilityChange} styleName="clear">
          <Icon name={visibility ? 'eye' : 'eye-crossed'} />
        </Button>
      </View>
    );
  }
}

export default connectStyle(ext('PasswordTextInput'))(PasswordTextInput);
