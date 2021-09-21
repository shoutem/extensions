import React from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { connectStyle } from '@shoutem/theme';
import { GridRow, defaultThemeVariables } from '@shoutem/ui';
import { TILE_GRID } from '../const';
import { isTabBarNavigation } from '../redux';
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
    textSize: PropTypes.string,
  };

  resolvePageProps() {
    const { style } = this.props;
    const { itemGutter } = this.getScreenSettings();
    const {
      dimensions: { height },
    } = this.state;
    const styleName = `${itemGutter}-gutter`;

    return {
      style: {
        minHeight: height,
        ...style.page,
      },
      styleName,
    };
  }

  renderRow(row, rowIndex) {
    const {
      itemText,
      itemGutter,
      backgroundImagesEnabled,
      textSize,
    } = this.getScreenSettings();
    const { style } = this.props;
    const styleName =
      itemGutter === 'noGutter'
        ? `${itemText} no-gutter`
        : `${itemText} ${itemGutter}-gutter`;
    const tileItemStyle = {
      item: {
        ...style.item,
        marginLeft:
          itemGutter === 'noGutter' ? 0 : defaultThemeVariables.SmallGutter,
      },
      text: { ...style.text, ...style[`${textSize}-text`] },
    };

    const shortcutItems = _.map(row, (shortcut, itemIndex) => {
      return (
        <TileItem
          key={`tile_item_${itemIndex}`}
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
      <GridRow key={`tile_row_${rowIndex}`} columns={2} style={style.gridRow}>
        {shortcutItems}
      </GridRow>
    );
  }

  renderRows(page = []) {
    const groupedShortcuts = GridRow.groupByRows(page, TileGrid.ROW_COUNT);
    return groupedShortcuts.map(this.renderRow);
  }
}

const mapPropsToStyleNames = styleNames => {
  return styleNames;
};

const mapStateToProps = state => ({
  isTabBar: isTabBarNavigation(state),
});

export default connect(mapStateToProps)(
  connectStyle(TILE_GRID, undefined, mapPropsToStyleNames)(TileGrid),
);
