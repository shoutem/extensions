import React, { PureComponent } from 'react';
import autoBindReact from 'auto-bind/react';
import PropTypes from 'prop-types';
import { connectStyle } from '@shoutem/theme';
import { Icon, View, Text, TouchableOpacity, Caption } from '@shoutem/ui';
import { ext } from '../const';

export class ConsentCheckbox extends PureComponent {
  static propTypes = {
    checked: PropTypes.bool,
    description: PropTypes.string,
    onToggle: PropTypes.func,
    style: PropTypes.any,
    error: PropTypes.string,
  };

  constructor(props) {
    super(props);

    autoBindReact(this);
  }

  handleTogglePress() {
    const { onToggle, checked } = this.props;

    if (onToggle) {
      onToggle(!checked);
    }
  }

  render() {
    const { checked, description, error } = this.props;

    const iconName = checked
      ? 'checkbox-rectangle-on'
      : 'checkbox-rectangle-off';

    return (
      <>
        <TouchableOpacity onPress={this.handleTogglePress}>
          <View styleName="horizontal v-start md-gutter-top md-gutter-right">
            <Icon name={iconName} />
            <Text styleName="md-gutter-left">{description}</Text>
          </View>
        </TouchableOpacity>
        {error && (
          <Caption styleName="form-error sm-gutter-top">{error}</Caption>
        )}
      </>
    );
  }
}

export default connectStyle(ext('ConsentCheckbox'))(ConsentCheckbox);
