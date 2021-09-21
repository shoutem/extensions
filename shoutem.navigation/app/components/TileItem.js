import React from 'react';
import { FolderItemContainer } from './FolderItemContainer';
import { NavigationBaseItem } from './NavigationBaseItem';

/**
 * Do not connect to style. Style it trough List screen so dimension related style can be
 * used to calculate list dimensions.
 */
export default class TileItem extends NavigationBaseItem {
  render() {
    const { style, styleName, showBackground } = this.props;
    const shortcutSettings = this.getShortcutLayoutSettings('tileGrid');
    const backgroundImageUrl = showBackground
      ? shortcutSettings.normalIconUrl
      : undefined;

    return (
      <FolderItemContainer
        onPress={this.onPress}
        style={style.item}
        styleName={styleName}
        backgroundImageUrl={backgroundImageUrl}
      >
        {this.renderText()}
      </FolderItemContainer>
    );
  }
}
