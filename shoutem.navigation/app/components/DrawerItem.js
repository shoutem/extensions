import React from 'react';
import { connectStyle } from '@shoutem/theme';
import { Touchable } from '@shoutem/ui';
import { ext } from '../const';
import { NavigationBaseItem } from './NavigationBaseItem';

class DrawerItem extends NavigationBaseItem {
  render() {
    const { style } = this.props;

    return (
      <Touchable onPress={this.onPress} style={style.item}>
        {this.renderIcon()}
        {this.renderText()}
      </Touchable>
    );
  }
}

const mapPropsToStyleNames =
  // eslint-disable-next-line no-confusing-arrow
  (styleNames, props) =>
    props.selected ? [...styleNames, 'selected'] : styleNames;

export default connectStyle(
  ext('DrawerItem'),
  undefined,
  mapPropsToStyleNames,
)(DrawerItem);
