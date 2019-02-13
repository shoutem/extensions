import PropTypes from 'prop-types';
import React from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';
import { connectStyle } from '@shoutem/theme';

import { GridRow, View, defaultThemeVariables, Device } from '@shoutem/ui';

import {
  TILE_GRID,
  TAB_BAR_ITEM_HEIGHT,
  IPHONE_X_HOME_INDICATOR_PADDING,
  IPHONE_X_NOTCH_PADDING,
  NAVIGATION_HEADER_HEIGHT,
} from '../const';
import { isTabBarNavigation, resolveScrollViewProps } from '../helpers';
import TileItem from './TileItem';
import FolderBase from './FolderBase';

class TileGrid extends FolderBase {
  // itemText value when there is no text
  static NO_TEXT = 'noText';
  static ROW_COUNT = 2;

  static propTypes = {
    ...FolderBase.propTypes,
    // Text position; Also defines if there shouldn't be text.
    itemText: PropTypes.string,
    // Gutter size key
    itemGutter: PropTypes.string,
  };

  resolveScrollViewProps() {
    return resolveScrollViewProps(this.props);
  }

  resolvePageProps() {
    const { style } = this.props;
    const { itemGutter } = this.getLayoutSettings();
    const { dimensions: { height } } = this.state;
    const styleName = `${itemGutter}-gutter`;

    return {
      style: {
        minHeight: height,
        ...style.page,
      },
      styleName,
    };
  }

  renderRow(row) {
    const { itemText, itemGutter, backgroundImagesEnabled } = this.getLayoutSettings();
    const { style } = this.props;
    const styleName = itemGutter === 'noGutter' ? `${itemText} no-gutter` : `${itemText} ${itemGutter}-gutter`;
    const tileItemStyle = {
      item: {
        ...style.item,
        marginLeft: itemGutter === 'noGutter' ? 0 : defaultThemeVariables.SmallGutter,
      },
      text: style.text,
    };

    const shortcutItems = _.map(row, (shortcut) => {
      return (
        <TileItem
          showText={itemText !== TileGrid.NO_TEXT}
          shortcut={shortcut}
          onPress={this.itemPressed}
          style={tileItemStyle}
          styleName={styleName}
          showBackground={backgroundImagesEnabled}
        />
      );
    });

    return (
      <GridRow columns={2} style={style.gridRow}>
        {shortcutItems}
      </GridRow>
    );
  }

  renderRows(page = []) {
    const groupedShortcuts = GridRow.groupByRows(page, TileGrid.ROW_COUNT);
    return groupedShortcuts.map(this.renderRow);
  }
}

const mapPropsToStyleNames = (styleNames, props) => {
  return styleNames;
};

const mapStateToProps = (state) => ({
  isTabBar: isTabBarNavigation(state),
});

export default connect(mapStateToProps)(
  connectStyle(TILE_GRID, undefined, mapPropsToStyleNames)(TileGrid)
);
