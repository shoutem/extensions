import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import _ from 'lodash';
import { connectStyle } from '@shoutem/theme';
import { dimensionRelativeToIphone, Device } from '@shoutem/ui';
import { LIST, IPHONE_X_HOME_INDICATOR_PADDING } from '../const';
import { isTabBarNavigation } from '../redux';
import { getRouteParams } from '../services';
import ListItem from './ListItem';
import FolderBase from './FolderBase';

class List extends FolderBase {
  static propTypes = {
    ...FolderBase.propTypes,
    listAlignment: PropTypes.string,
    topOffset: PropTypes.number,
    showText: PropTypes.bool,
    backgroundImage: PropTypes.string,
    textSize: PropTypes.string,
  };

  resolvePageProps() {
    const { topOffset, listAlignment } = this.getScreenSettings();
    const {
      dimensions: { height },
    } = this.state;
    const { style, isTabBar } = this.props;

    const homeBarHeight = Device.select({
      iPhoneX: IPHONE_X_HOME_INDICATOR_PADDING,
      iPhoneXR: IPHONE_X_HOME_INDICATOR_PADDING,
      default: 0,
    });

    return {
      style: {
        paddingTop: dimensionRelativeToIphone(topOffset),
        minHeight: isTabBar ? height : height - homeBarHeight,
        ...style.page,
      },
      styleName: listAlignment,
    };
  }

  renderRow(shortcut, index) {
    const {
      showText,
      showIcon,
      inItemAlignment,
      textSize,
    } = this.getScreenSettings();
    const { style } = this.props;

    const listItemStyle = {
      ...style,
      text: { ...style.text, ...style[`${textSize}-text`] },
    };

    return (
      <ListItem
        key={`item_${index}`}
        showText={showText}
        showIcon={showIcon}
        shortcut={shortcut}
        inItemAlignment={inItemAlignment}
        onPress={this.itemPressed}
        style={listItemStyle}
      />
    );
  }
}

const mapPropsToStyleNames = (styleNames, props) => {
  const { inItemAlignment } = _.get(getRouteParams(props), 'screenSettings');

  // Add inItemAlignment as style name to align content
  styleNames.push(`in-item-alignment-${inItemAlignment}`);

  return FolderBase.mapPropsToStyleNames(styleNames, {
    ...getRouteParams(props).screenSettings,
    isRootScreen: getRouteParams(props).isRootScreen,
  });
};

const mapStateToProps = state => ({
  isTabBar: isTabBarNavigation(state),
});

export default connect(mapStateToProps)(
  connectStyle(LIST, undefined, mapPropsToStyleNames)(List),
);
