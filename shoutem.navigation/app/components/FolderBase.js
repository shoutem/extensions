import React, { PureComponent } from 'react';
import autoBindReact from 'auto-bind/react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { Image, ScrollView, View } from '@shoutem/ui';
import { appActions } from 'shoutem.application';
import { navigateTo, Scaler } from '../services';

const defaultResolution = {
  width: 375,
  height: 667,
};

/**
 * Folder base component implements folder components shared methods.
 * Provides render lifecycle which can be overridden for custom layout.
 *  1. render
 *  2. renderContentContainer
 *  3. renderScrollView
 *    1. groupChildrenIntoPages - group shortcuts and pass to next step,
 *                                override this method for custom grouping
 *  4. renderPages
 *  5. renderPage
 *  6. renderRows
 *  7. renderRow
 *  8. renderItems
 *  9. renderItem
 *  Folder data structure
 *   Pages - array of page
 *    Page - array of rows
 *     Row - array of items
 *      Item - shortcut object
 *  Render methods use following style to style rendered component
 *   pageStyle
 *   rowStyle
 *   itemStyle - nested {item, icon, text} style
 * Implement "resolveScreenStyles" at child class to provide previously mentioned styles.
 * Required props
 *  executeShortcut {redux action}
 */
export default class FolderBase extends PureComponent {
  static propTypes = {
    isRootScreen: PropTypes.bool,
    shortcut: PropTypes.object.isRequired,
    style: PropTypes.object,
    executeShortcut: PropTypes.func,
    showText: PropTypes.bool,
    iconSize: PropTypes.string,
  };

  static mapPropsToStyleNames = (styleNames, props) => {
    const { showIcon, showText, iconSize } = props;

    styleNames.push(`${iconSize}-icon`);

    if (!showText) {
      styleNames.push('text-hidden');
    }

    if (!showIcon) {
      styleNames.push('icon-hidden');
    }

    // This should be present, but we're commenting out for backward
    // compatibility purposes
    /*     if (isRootScreen) {
      styleNames.push('main-navigation');
    } */

    return styleNames;
  };

  constructor(props, context) {
    super(props, context);

    autoBindReact(this);

    this.state = {
      dimensions: {
        width: null,
        height: null,
      },
    };

    this.scaler = new Scaler();
    // Android: lineHeight must be an integer, so we're rounding possible float value to integer.
    // https://github.com/facebook/react-native/issues/7877
    this.scaler.addPropTransformer('lineHeight', oldValue =>
      Math.round(oldValue),
    );
  }

  /**
   * Get screen layout settings from props.
   * By default provides layout settings from this.props but it accepts custom props.
   * @param props (optional) Used for nextProps
   * @returns {*}
   */
  getScreenSettings(props = this.props) {
    return _.get(props, 'route.params.screenSettings', {});
  }

  isRootScreen(props = this.props) {
    return _.get(props, 'route.params.isRootScreen');
  }

  /**
   * @param width Page width
   * @param height Page height
   */
  updateDimensions(width, height, callback) {
    this.setState(
      {
        dimensions: {
          width,
          height,
        },
      },
      callback,
    );
  }

  /**
   * Save new page width and height so it can be reused
   * Refresh dimension related state after updating page dimensions.
   * @param width Layout width
   * @param height Layout height
   * @param resolvedHeight Layout height after checking for TabBar navigation
   */
  layoutChanged({
    nativeEvent: {
      layout: { width, height },
    },
  }) {
    this.scaler.resolveRatioByWidth({ width, height }, defaultResolution);
    this.updateDimensions(width, height);
  }

  /**
   * Scale value to fit referent resolution.
   * @param value {int}
   * @returns {floor}
   */
  scale(value) {
    return this.scaler.scale(value);
  }

  /**
   * Open a shortcut screen.
   * @param shortcut
   */
  itemPressed(shortcut) {
    const shortcutName = _.get(shortcut, 'navigationCanonicalName');
    const screenName = _.get(shortcut, ['screens', '0', 'canonicalName']);

    const isAction =
      shortcut.action &&
      appActions[shortcut.action] &&
      _.isFunction(appActions[shortcut.action]);
    const action = appActions[shortcut.action];
    const handleShortcutPress = isAction
      ? () => action(shortcut)
      : () =>
          navigateTo(shortcutName, {
            screen: screenName,
            params: {},
          });

    handleShortcutPress();
  }

  /**
   * Default grouping, it behaves like only one page is to be rendered.
   * @param children
   * @returns {*}
   */
  groupChildrenIntoPages(children) {
    // By default group all rows into one page
    return [children];
  }

  resolveRowProps() {
    return {};
  }

  resolvePageProps() {
    return {};
  }

  resolveScrollViewProps() {
    const { style } = this.props;

    return {
      // When Navigation screen is nested inside FolderBase Main navigation (non-tab & non-drawer navigations), vertical scroll
      // is not placed to the right edge of the screen, but has ~20% offset on iOS.
      // Removing scroll because of this, but also because it's better UI.
      showsVerticalScrollIndicator: false,
      style: {
        ...style.scrollView,
      },
    };
  }

  // eslint-disable-next-line no-unused-vars
  renderItem(shortcut, index) {}

  /**
   * Iterate trough row items.
   * @param page
   * @returns {Array}
   */
  renderItems(row) {
    return row.map(this.renderItem);
  }

  /**
   * Render row and its items
   * @param row - array of items
   * @returns {Array}
   */
  renderRow(row, index) {
    return (
      <View key={`row_${index}`} {...this.resolveRowProps()}>
        {this.renderItems(row)}
      </View>
    );
  }

  /**
   * Iterate trough page rows.
   * @param page
   * @returns {Array}
   */
  renderRows(page = []) {
    return page.map(this.renderRow);
  }

  /**
   * Render page and it rows.
   * @param page - array of rows.
   * @param index
   * @returns {XML}
   */
  renderPage(page, index = 1) {
    return (
      <View key={`page_${index}`} {...this.resolvePageProps()}>
        {this.renderRows(page)}
      </View>
    );
  }

  /**
   * Iterate trough pages.
   * @param pages - is array of page.
   * @returns {Array}
   */
  renderPages(pages = []) {
    return pages.map(this.renderPage);
  }

  renderScrollView() {
    const { shortcut } = this.props;
    return (
      <ScrollView {...this.resolveScrollViewProps()}>
        {this.renderPages(this.groupChildrenIntoPages(shortcut.children))}
      </ScrollView>
    );
  }

  renderContentContainer() {
    const {
      dimensions: { width, height },
    } = this.state;

    if (width === null || height === null) {
      return null;
    }

    const { backgroundImage } = this.getScreenSettings();

    if (backgroundImage) {
      return (
        <View style={this.props.style.backgroundWrapper}>
          <Image styleName="fill-parent" source={{ uri: backgroundImage }} />
          {this.renderScrollView()}
        </View>
      );
    }
    return this.renderScrollView();
  }

  render() {
    return (
      <View onLayout={this.layoutChanged} styleName="flexible">
        {this.renderContentContainer()}
      </View>
    );
  }
}
