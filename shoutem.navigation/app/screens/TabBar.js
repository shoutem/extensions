import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import {
  ScreenStack,
  navigateTo,
  jumpToKey,
  resetToRoute,
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

import {
  executeShortcut,
} from 'shoutem.application';

import { ext } from '../const';
import TabBarItem from '../components/TabBarItem';
import { shortcutChildrenRequired } from '../helpers';
import {
  TAB_BAR_NAVIGATION_STACK,
  getTabNavigationStateFromTabBarState,
  getTabNavigationStack,
} from '../redux';

const TABS_LIMIT = 5;

export class TabBar extends PureComponent {
  static propTypes = {
    // Server props
    shortcut: PropTypes.object.isRequired,
    startingScreen: PropTypes.string,
    showText: PropTypes.bool,
    showIcon: PropTypes.bool,

    // Props from local state (connect)

    navigationState: PropTypes.object,
    // navigationState.routes contains the specific tab shortcut object

    tabStates: PropTypes.object,
    tabStacks: PropTypes.object,
    executeShortcut: PropTypes.func,
    navigateTo: PropTypes.func,
    navigateBack: PropTypes.func,
    resetToRoute: PropTypes.func,
    jumpToKey: PropTypes.func,
    setActiveNavigationStack: PropTypes.func,
  };

  state = {
    // Stores the currently selected shortcut. We cannot use the active
    // shortcut from global state, because shortcuts can be nested. The
    // tab should remain selected while the shortcut from the tab bar is
    // active, or any of its children are active.
    selectedShortcut: null,
  };

  constructor(props, context) {
    super(props, context);

    this.openShortcut = this.openShortcut.bind(this);
    // Debounce the reset tab to top to avoid weird issues (e.g., app freezes)
    // when the navigation state is being reset during transitions.
    this.resetTabNavigationStateToTop = _.debounce(this.resetTabNavigationStateToTop, 300, {
      maxWait: 100,
    });
  }

  componentWillMount() {
    const startingShortcut = this.getStartingShortcut();
    this.openShortcut(startingShortcut);
  }

  getStartingShortcut() {
    const { startingScreen, shortcut } = this.props;
    return _.find(shortcut.children, ['id', startingScreen]) || _.first(shortcut.children);
  }

  getTabRouteForShortcut(shortcut) {
    return {
      context: {
        shortcutId: shortcut.id,
      },
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
    this.props.resetToRoute(firstRoute, tabNavigationStackName);
  }

  openShortcut(shortcut) {
    // eslint-disable-next-line no-shadow
    const {
      executeShortcut,
      navigationState,
      navigateTo,
      jumpToKey,
      setActiveNavigationStack,
    } = this.props;

    const { selectedShortcut } = this.state;

    if (shortcut === selectedShortcut) {
      // Tapping twice on the same tab resets tab screens stack.
      this.resetTabNavigationStateToTop(shortcut.id);
      return;
    }

    const navigationStack = getTabNavigationStack(shortcut.id);
    const stackName = navigationStack.name;

    if (shortcut.action) {
      // This is an external action, we don't want to change anything
      // in the ui, just execute this shortcut
      executeShortcut(shortcut.id, undefined, navigationStack);
      return;
    }

    if (hasRouteWithKey(navigationState, stackName)) {
      // We are returning to an existing tab, it is already
      // rendered, just jump to it
      setActiveNavigationStack(navigationStack);
      jumpToKey(stackName, TAB_BAR_NAVIGATION_STACK);
    } else {
      // We are navigation to a tab for the first time, push the new
      // tab to the navigation stack
      setActiveNavigationStack(navigationStack);
      navigateTo(this.getTabRouteForShortcut(shortcut), TAB_BAR_NAVIGATION_STACK);
      executeShortcut(shortcut.id, undefined, navigationStack);
    }

    // Update the selected shortcut, so that the correct tab is
    // marked as selected in the tab bar ui
    this.setState({
      selectedShortcut: shortcut,
    });
  }

  renderTabBarItems() {
    const {
      showText,
      showIcon,
      shortcut: { children },
    } = this.props;

    const { selectedShortcut } = this.state;

    return _.take(children, TABS_LIMIT).map(shortcut => (
      <TabBarItem
        key={`tab-bar-item-${shortcut.id}`}
        showText={showText}
        showIcon={showIcon}
        shortcut={shortcut}
        onPress={this.openShortcut}
        selected={shortcut === selectedShortcut}
      />
    ));
  }

  render() {
    const { style } = this.props;

    return (
      <Screen style={style.screen}>
        <NavigationBar hidden />
        <ScreenStack
          styleName="without-transitions"
          useNativeAnimations={false}
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

const mapStateToProps = (state) => ({
  ...state[ext()].tabBar,
});

const mapDispatchToProps = {
  executeShortcut,
  navigateTo,
  jumpToKey,
  navigateBack,
  resetToRoute,
  setActiveNavigationStack,
};
export default shortcutChildrenRequired(
  connect(mapStateToProps, mapDispatchToProps)(connectStyle(ext('TabBar'))(TabBar))
);
