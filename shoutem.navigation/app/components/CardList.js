import PropTypes from 'prop-types';
import React from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';

import { connectStyle } from '@shoutem/theme';
import { Device } from '@shoutem/ui';

import {
  CARD_LIST,
  ext,
  IPHONE_X_HOME_INDICATOR_PADDING,
  IPHONE_X_NOTCH_PADDING,
  NAVIGATION_HEADER_HEIGHT,
  TAB_BAR_ITEM_HEIGHT,
} from '../const';
import { isTabBarNavigation, resolveScrollViewProps } from '../helpers';
import CardListItem from './CardListItem';
import FolderBase from './FolderBase';

const HEIGHT_RATIO_STYLE_KEY = 'heights';

class CardList extends FolderBase {
  // itemText value when there is no text
  static NO_TEXT = 'noText';

  static propTypes = {
    ...FolderBase.propTypes,
    // Text position; Also defines if there shouldn't be text.
    itemText: PropTypes.string,
    // Gutter size key
    itemGutter: PropTypes.string,
    // Used to calculate item height
    cardHeight: PropTypes.string,
    // Is item full screen width
    isFullWidth: PropTypes.bool,
  };

  resolveScrollViewProps() {
    return resolveScrollViewProps(this.props);
  }

  resolvePageProps() {
    const { style } = this.props;
    const { itemGutter, isFullWidth } = this.getLayoutSettings();
    const { dimensions: { height } } = this.state;
    const styleName = `${itemGutter}-gutter ${isFullWidth ? 'full-width' : ''}`;

    return {
      style: {
        minHeight: height,
        ...style.page,
      },
      styleName,
    };
  }

  renderRow(shortcut, index) {
    const { itemText, backgroundImagesEnabled, cardHeight, itemGutter } = this.getLayoutSettings();
    const { style } = this.props;
    const styleName = `${itemText} ${itemGutter}-gutter`;
    const { dimensions: { width } } = this.state;
    const heightRatio = _.get(style, ['item', HEIGHT_RATIO_STYLE_KEY, cardHeight], 1);
    const cardItemStyle = {
      item: {
        ...style.item,
        height: width * heightRatio,
        backgroundImage: {
          width,
          height: width * heightRatio,
        },
      },
      text: style.text,
    };
    // Remove non RN style
    delete cardItemStyle.item[HEIGHT_RATIO_STYLE_KEY];
    return (
      <CardListItem
        key={`item_${index}`}
        showText={itemText !== CardList.NO_TEXT}
        shortcut={shortcut}
        onPress={this.itemPressed}
        style={cardItemStyle}
        styleName={styleName}
        showBackground={backgroundImagesEnabled}
      />
    );
  }
}

const mapPropsToStyleNames = (styleNames, props) => {
  return styleNames;
};

const mapStateToProps = (state) => ({
  isTabBar: isTabBarNavigation(state),
});

export default connect(mapStateToProps)(
  connectStyle(CARD_LIST, undefined, mapPropsToStyleNames)(CardList)
);
