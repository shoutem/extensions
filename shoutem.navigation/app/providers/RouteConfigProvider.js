import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import autoBindReact from 'auto-bind/react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { ThemeShape } from '@shoutem/theme';
import { ScrollView, Toast } from '@shoutem/ui';
import {
  getAppInitQueueComplete,
  getHiddenShortcuts,
} from 'shoutem.application/redux';
import { HeaderTitle } from '../components';
import { navigationRef } from '../const';
import { NavigationTree } from '../navigators';
import { setNavigationInitialized } from '../redux';
import { collectShortcutScreens, Decorators, ModalScreens } from '../services';
import NavigationStylesProvider from './NavigationStylesProvider';

let normalizedShortcuts = [];

function normalizeShortcuts(shortcuts) {
  let EXISTING_ROUTE_NAMES = {};

  return _.reduce(
    shortcuts,
    (result, shortcut) => {
      const { canonicalName, id } = shortcut;
      const hasNameAdded = _.has(EXISTING_ROUTE_NAMES, id);
      const navigationName = hasNameAdded
        ? EXISTING_ROUTE_NAMES[id]
        : `${canonicalName}.${id}`;
      EXISTING_ROUTE_NAMES = {
        ...EXISTING_ROUTE_NAMES,
        ...(!hasNameAdded && { [id]: navigationName }),
      };

      return [
        ...result,
        {
          ...shortcut,
          navigationCanonicalName: navigationName,
          ...(!_.isEmpty(shortcut.children) && {
            children: normalizeShortcuts(shortcut.children),
          }),
        },
      ];
    },
    [],
  );
}

export class RouteConfigProvider extends PureComponent {
  constructor(props) {
    super(props);

    autoBindReact(this);

    Decorators.createGlobalDecorator();

    const decoratedScreens = Decorators.decorateScreens(props.screens);

    this.state = {
      decoratedScreens,
      normalizedShortcuts: [],
      navReady: false,
    };
  }

  componentDidMount() {
    const { firstShortcut, shortcuts } = this.props;
    const { decoratedScreens } = this.state;
    normalizedShortcuts = normalizeShortcuts(shortcuts);
    const cleanShortcuts = [...shortcuts];
    _.remove(cleanShortcuts, { id: firstShortcut.id });
    ModalScreens.registerModalScreens(
      _.reduce(
        cleanShortcuts,
        (result, shortcut) => {
          if (!_.get(shortcut, 'screen')) {
            return result;
          }
          const screens = collectShortcutScreens(shortcut, decoratedScreens);
          return [
            ...result,
            ...screens.map(screen => {
              // screens(collectShortcutScreens result) returns only name & component
              // We need whole screen object here, to extract it's settings
              const shortcutScreen = _.find(shortcut.screens, {
                canonicalName: screen.name,
              });
              const screenSettings = shortcutScreen?.settings || {};
              return {
                name: screen.name,
                initialParams: { shortcut, screenSettings },
                options: {
                  // eslint-disable-next-line react/prop-types
                  headerTitle: ({ style, children }) => (
                    <HeaderTitle
                      style={style}
                      shortcut={shortcut}
                      title={children}
                    />
                  ),
                },
              };
            }),
          ];
        },
        [],
      ),
    );
    // eslint-disable-next-line react/no-did-update-set-state
    this.setState({ normalizedShortcuts, navReady: true });
  }

  handleReady() {
    const { setNavigationInitialized } = this.props;

    setNavigationInitialized();
  }

  handleAnimationDriverChange(animationDriver) {
    this.setState({ animationDriver });
  }

  render() {
    const {
      decoratedScreens,
      normalizedShortcuts,
      navReady,
      animationDriver,
    } = this.state;
    const {
      firstShortcut,
      hiddenShortcuts,
      initQueueComplete,
      navBarSettings,
    } = this.props;

    const appReady = navReady && initQueueComplete && animationDriver;

    return (
      <ScrollView.DriverProvider
        onAnimationDriverChange={this.handleAnimationDriverChange}
      >
        {appReady && (
          <NavigationStylesProvider
            animationDriver={animationDriver}
            navBarSettings={navBarSettings}
          >
            <NavigationContainer ref={navigationRef} onReady={this.handleReady}>
              <NavigationTree
                firstShortcut={firstShortcut}
                shortcuts={normalizedShortcuts}
                screens={decoratedScreens}
                hiddenShortcuts={hiddenShortcuts}
              />
            </NavigationContainer>
            <Toast.Provider />
          </NavigationStylesProvider>
        )}
      </ScrollView.DriverProvider>
    );
  }
}

RouteConfigProvider.propTypes = {
  hiddenShortcuts: PropTypes.array.isRequired,
  initQueueComplete: PropTypes.bool.isRequired,
  navBarSettings: PropTypes.object.isRequired,
  screens: PropTypes.object.isRequired,
  setNavigationInitialized: PropTypes.func.isRequired,
  shortcuts: PropTypes.array.isRequired,
  firstShortcut: PropTypes.object,
};

RouteConfigProvider.defaultProps = {
  firstShortcut: undefined,
};

RouteConfigProvider.contextTypes = {
  theme: ThemeShape,
};

const mapDispatchToProps = { setNavigationInitialized };

function mapStateToProps(state) {
  return {
    hiddenShortcuts: getHiddenShortcuts(state),
    initQueueComplete: getAppInitQueueComplete(state),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(RouteConfigProvider);
