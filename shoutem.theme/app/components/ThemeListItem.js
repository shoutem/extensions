import React, { PureComponent } from 'react';
import autoBindReact from 'auto-bind/react';
import PropTypes from 'prop-types';
import { connectStyle } from '@shoutem/theme';
import { Icon, Row, Text, TouchableOpacity, View } from '@shoutem/ui';
import { ext } from '../const';

export class ThemeListItem extends PureComponent {
  constructor(props) {
    super(props);

    autoBindReact(this);
  }

  handleItemPress() {
    const { onPress, theme } = this.props;

    if (onPress) {
      onPress(theme);
    }
  }

  render() {
    const { theme, active, style } = this.props;
    const iconName = active ? 'checkbox-on' : 'checkbox-off';

    return (
      <TouchableOpacity onPress={this.handleItemPress}>
        <Row style={style.container} styleName="small">
          <View styleName="vertical">
            <Text style={style.text}>{theme.title}</Text>
          </View>
          <Icon name={iconName} />
        </Row>
      </TouchableOpacity>
    );
  }
}

ThemeListItem.propTypes = {
  theme: PropTypes.object.isRequired,
  active: PropTypes.bool,
  style: PropTypes.any,
  onPress: PropTypes.func,
};

ThemeListItem.defaultProps = {
  active: false,
  onPress: undefined,
  style: {},
};

export default connectStyle(ext('ThemeListItem'))(ThemeListItem);
