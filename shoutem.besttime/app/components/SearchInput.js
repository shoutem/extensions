import React, { PureComponent } from 'react';
import autoBindReact from 'auto-bind/react';
import PropTypes from 'prop-types';
import { connectStyle } from '@shoutem/theme';
import { Button, Icon, TextInput, View } from '@shoutem/ui';
import { ext } from '../const';

export class SearchInput extends PureComponent {
  static propTypes = {
    input: PropTypes.string,
    onChangeText: PropTypes.func,
    onClearPress: PropTypes.func,
  };

  constructor(props) {
    super(props);

    autoBindReact(this);

    this.state = {
      input: props.input || '',
    };
  }

  handleChangeText(text) {
    const { onChangeText } = this.props;

    onChangeText(text);
  }

  handleClearText() {
    const { onClearPress } = this.props;

    onClearPress();
  }

  render() {
    const { input } = this.props;

    return (
      <View styleName="clear">
        <View styleName="horizontal space-between v-center">
          <Icon name="search" />
          <TextInput
            autoCorrect={false}
            autoFocus
            onChangeText={this.handleChangeText}
            returnKeyType="done"
            value={input}
          />
          <Button styleName="clear" onPress={this.handleClearText}>
            <Icon name="clear-text" />
          </Button>
        </View>
      </View>
    );
  }
}

export default connectStyle(ext('SearchInput'))(SearchInput);
