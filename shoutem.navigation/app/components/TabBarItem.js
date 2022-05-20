import React from 'react';
import { connectStyle } from '@shoutem/theme';
import { Touchable } from '@shoutem/ui';
import { ext } from '../const';
import { NavigationBaseItem } from './NavigationBaseItem';

class TabBarItem extends NavigationBaseItem {
  render() {
    const { shortcut, style } = this.props;

    if (!shortcut) {
      return null;
    }

    return (
      <Touchable onPress={this.onPress} styleName="flexible" style={style.item}>
        {this.renderIcon()}
        {this.renderText()}
      </Touchable>
    );
  }
}

const mapPropsToStyleNames = (styleNames, props) => {
  const customStyleNames = [];

  if (props.selected) {
    customStyleNames.push('selected');
  }

  if (props.showIcon && props.showText) {
    customStyleNames.push('icon-and-text');
  } else if (props.showIcon) {
    customStyleNames.push('icon-only');
  } else if (props.showText) {
    customStyleNames.push('text-only');
  }

  return styleNames.concat(customStyleNames);
};

export default connectStyle(
  ext('TabBarItem'),
  undefined,
  mapPropsToStyleNames,
)(TabBarItem);
