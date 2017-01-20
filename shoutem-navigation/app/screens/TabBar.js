import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  ScreenStack,
  navigateTo,
  jumpToKey,
  reset,
  navigateBack,
  setActiveNavigationStack,
  hasRouteWithKey,
} from '@shoutem/core/navigation';
import { connectStyle } from '@shoutem/theme';
import _ from 'lodash';
import {
  View,
  Screen,
} from '@shoutem/ui';
import {
  NavigationBar,
} from '@shoutem/ui/navigation';

import { ext } from '../const';
import TabBarItem from '../components/TabBarItem';
import { shortcutChildrenRequired } from '../helpers';
import {
  TAB_BAR_NAVIGATION_STACK,
  getTabNavigationStateFromTabBarState,
  getTabNavigationStack,
} from '../redux';

const TABS_LIMIT = 5;

export class TabBar extends Component {
  static propTypes = {
    // Server props
    shortcut: React.PropTypes.object.isRequired,
    startingScreen: React.PropTypes.string,
    showText: React.PropTypes.bool,
    showIcon: React.PropTypes.bool,

    // Props from local state (connect)

    navigationState: React.PropTypes.object,
    // navigationState.routes contains the specific tab shortcut object

    tabStates: React.PropTypes.object,
    tabStacks: React.PropTypes.object,
    navigateTo: React.PropTypes.func,
    navigateBack: React.PropTypes.func,
    reset: React.PropTypes.func,
    jumpToKey: React.PropTypes.func,
    setActiveNavigationStack: React.PropTypes.func,
  };

  constructor(props, context) {
    super(props, context);

    this.openShortcut = this.openShortcut.bind(this);
  }

  componentWillMount() {
    const startingShortcut = this.getStartingShortcut();
    this.openShortcut(startingShortcut);
  }

  getStartingShortcut() {
    const { startingScreen, shortcut } = this.props;
    const childShortcuts = shortcut.children;
    return _.find(childShortcuts, startingScreen) || _.first(childShortcuts);
  }

  getTabRouteForShortcut(shortcut) {
    return {
      key: getTabNavigationStack(shortcut.id).name,
      screen: ext('Tab'),
      props: {
        shortcut,
      },
    };
  }

  resetTabNavigationStateToTop(tabId) {
    const tabNavigationState = getTabNavigationStateFromTabBarState(this.props, tabId);
    const tabNavigationStackName = getTabNavigationStack(tabId);
    const firstRoute = _.head(tabNavigationState.routes);
    this.props.reset([firstRoute], 0, tabNavigationStackName);
  }

  openShortcut(shortcut) {
    // eslint-disable-next-line no-shadow
    const { navigationState, navigateTo, jumpToKey, setActiveNavigationStack } = this.props;
    const activeShortcut = this.getActiveShortcut();

    if (shortcut === activeShortcut) {
      // Tapping twice on the same tab resets tab screens stack.
      this.resetTabNavigationStateToTop(shortcut.id);
      return;
    }

    const navigationStack = getTabNavigationStack(shortcut.id);
    setActiveNavigationStack(navigationStack);

    const stackName = navigationStack.name;
    if (hasRouteWithKey(navigationState, stackName)) {
      jumpToKey(stackName, TAB_BAR_NAVIGATION_STACK);
    } else {
      navigateTo(this.getTabRouteForShortcut(shortcut), undefined, TAB_BAR_NAVIGATION_STACK);
    }
  }

  getActiveShortcut() {
    const { navigationState } = this.props;
    const index = navigationState.index;
    const shortcutPath = ['routes', [index], 'props', 'shortcut'];
    const currentShortcut = (index > -1) ? _.get(navigationState, shortcutPath) : null;
    return currentShortcut;
  }

  renderTabBarItems() {
    const { showText, showIcon, shortcut: { children } } = this.props;
    const activeShortcut = this.getActiveShortcut();

    return _.take(children, TABS_LIMIT).map(shortcut => (
      <TabBarItem
        key={`tab-bar-item-${shortcut.id}`}
        showText={showText}
        showIcon={showIcon}
        shortcut={shortcut}
        onPress={this.openShortcut}
        selected={activeShortcut === shortcut}
      />
    ));
  }

  render() {
    return (
      <Screen styleName="full-screen">
        <NavigationBar hidden />
        <ScreenStack
          styleName="without-transitions"
          gestureResponseDistance={0}
          direction="vertical"
          navigationState={this.props.navigationState}
          onNavigateBack={this.props.navigateBack}
        />
        <View styleName="horizontal">
          {this.renderTabBarItems()}
        </View>
      </Screen>
    );
  }
}

const mapStateToProps = (state) => state[ext()].tabBar;
const mapDispatchToProps = {
  navigateTo,
  jumpToKey,
  navigateBack,
  reset,
  setActiveNavigationStack,
};
export default shortcutChildrenRequired(
  connect(mapStateToProps, mapDispatchToProps)(connectStyle(ext('TabBar'))(TabBar))
);
