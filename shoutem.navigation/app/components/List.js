import PropTypes from 'prop-types';
import React from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';

import { dimensionRelativeToIphone, Device } from '@shoutem/ui';
import { connectStyle } from '@shoutem/theme';

import {
  LIST,
  ext,
  IPHONE_X_HOME_INDICATOR_PADDING,
  IPHONE_X_NOTCH_PADDING,
  NAVIGATION_HEADER_HEIGHT,
  TAB_BAR_ITEM_HEIGHT,
} from '../const';
import { isTabBarNavigation, resolveScrollViewProps } from '../helpers';
import ListItem from './ListItem';
import FolderBase from './FolderBase';

class List extends FolderBase {
  static propTypes = {
    ...FolderBase.propTypes,
    listAlignment: PropTypes.string,
    topOffset: PropTypes.number,
    showText: PropTypes.bool,
    backgroundImage: PropTypes.string,
  };

  resolveScrollViewProps() {
    return resolveScrollViewProps(this.props);
  }

  resolvePageProps() {
    const { topOffset, listAlignment } = this.getLayoutSettings();
    const { dimensions: { height } } = this.state;
    const { style } = this.props;

    return {
      style: {
        paddingTop: dimensionRelativeToIphone(topOffset),
        minHeight: height,
        ...style.page,
      },
      styleName: listAlignment,
    };
  }

  renderRow(shortcut, index) {
    const { showText, showIcon, inItemAlignment } = this.getLayoutSettings();
    const { style } = this.props;
    return (
      <ListItem
        key={`item_${index}`}
        showText={showText}
        showIcon={showIcon}
        shortcut={shortcut}
        inItemAlignment={inItemAlignment}
        onPress={this.itemPressed}
        style={style}
      />
    );
  }
}

const mapPropsToStyleNames = (styleNames, props) => {
  const { inItemAlignment } = props;

  // Add inItemAlignment as style name to align content
  styleNames.push(`in-item-alignment-${inItemAlignment}`);

  return FolderBase.mapPropsToStyleNames(styleNames, props);
};

const mapStateToProps = (state) => ({
  isTabBar: isTabBarNavigation(state),
});

export default connect(mapStateToProps, undefined)(
  connectStyle(LIST, undefined, mapPropsToStyleNames)(List)
);
