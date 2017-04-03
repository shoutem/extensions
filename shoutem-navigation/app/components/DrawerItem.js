import React from 'react';
import { connectStyle } from '@shoutem/theme';
import { ext } from '../const';
import { NavigationBaseItem } from './NavigationBaseItem';
import { Touchable } from '@shoutem/ui';

class DrawerItem extends NavigationBaseItem {
  render() {
    return (
      <Touchable
        onPress={this.onPress}
        style={this.props.style.item}
      >
        {this.renderIcon()}
        {this.renderText()}
      </Touchable>
    );
  }
}

const mapPropsToStyleNames =
// eslint-disable-next-line no-confusing-arrow
  (styleNames, props) => props.selected ? [...styleNames, 'selected'] : styleNames;

export default connectStyle(ext('DrawerItem'), undefined, mapPropsToStyleNames)(DrawerItem);
