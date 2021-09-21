import React from 'react';
import { View } from '@shoutem/ui';
import { FolderItemContainer } from './FolderItemContainer';
import { NavigationBaseItem } from './NavigationBaseItem';

/**
 * Do not connect to style. Style it trough IconGrid screen so dimension related style can be
 * used to calculate grid dimensions.
 */
export default class IconGridItemCell extends NavigationBaseItem {
  render() {
    return (
      <FolderItemContainer onPress={this.onPress} style={this.props.style.item}>
        <View style={this.props.style.iconContainer}>{this.renderIcon()}</View>
        {this.renderText()}
      </FolderItemContainer>
    );
  }
}
