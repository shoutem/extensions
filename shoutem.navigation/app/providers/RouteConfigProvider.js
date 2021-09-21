import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import _ from 'lodash';
import autoBindReact from 'auto-bind/react';
import { ThemeShape } from '@shoutem/theme';
import { DriverShape } from '@shoutem/animation';
import { NavigationContainer } from '@react-navigation/native';
import {
  getHiddenShortcuts,
  getAppInitQueueComplete,
} from 'shoutem.application/redux';
import { createNavigatonStyles, ModalScreens } from '../services';
import { HeaderTitle } from '../components';
import { navigationRef } from '../const';
import { setNavigationInitialized } from '../redux';
import { NavigationTree } from '../navigators';

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
        : _.uniqueId(canonicalName);
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
  static propTypes = {
    shortcuts: PropTypes.array,
    firstShortcut: PropTypes.object,
    screens: PropTypes.object,
    initQueueComplete: PropTypes.bool,
  };

  static contextTypes = {
    theme: ThemeShape,
    animationDriver: DriverShape,
  };

  constructor(props) {
    super(props);

    autoBindReact(this);

    this.state = { normalizedShortcuts: [], navReady: false };
  }

  componentDidUpdate(prevProps) {
    const {
      firstShortcut,
      shortcuts,
      hiddenShortcuts,
      navBarSettings,
    } = this.props;

    const {
      shortcuts: prevShortcuts,
      hiddenShortcuts: prevHiddenShortcuts,
    } = prevProps;

    createNavigatonStyles({
      theme: this.context.theme,
      animationDriver: this.context.animationDriver,
      navBarSettings,
    });

    const shortcutsLoaded = _.isEmpty(prevShortcuts) && !_.isEmpty(shortcuts);

    if (shortcutsLoaded) {
      normalizedShortcuts = normalizeShortcuts(shortcuts);
    }

    const hiddenShortcutsUpdated = !_.isEqual(
      prevHiddenShortcuts,
      hiddenShortcuts,
    );

    if (shortcutsLoaded || (hiddenShortcutsUpdated && !_.isEmpty(shortcuts))) {
      const cleanShortcuts = [...shortcuts];
      _.remove(cleanShortcuts, { id: firstShortcut.id });
      ModalScreens.registerModalScreens(
        _.compact(
          _.map(cleanShortcuts, shortcut => {
            if (!_.get(shortcut, 'screen')) {
              return undefined;
            }

            return {
              name: _.get(shortcut, 'screen'),
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
        ),
      );

      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({ normalizedShortcuts, navReady: true });
    }
  }

  handleReady() {
    const { setNavigationInitialized } = this.props;

    setNavigationInitialized();
  }

  render() {
    const { normalizedShortcuts, navReady } = this.state;
    const {
      firstShortcut,
      screens,
      hiddenShortcuts,
      initQueueComplete,
    } = this.props;

    if (!navReady || !initQueueComplete) {
      return null;
    }

    return (
      <NavigationContainer ref={navigationRef} onReady={this.handleReady}>
        <NavigationTree
          firstShortcut={firstShortcut}
          shortcuts={normalizedShortcuts}
          screens={screens}
          hiddenShortcuts={hiddenShortcuts}
        />
      </NavigationContainer>
    );
  }
}

const mapDispatchToProps = { setNavigationInitialized };

const mapStateToProps = state => ({
  hiddenShortcuts: getHiddenShortcuts(state),
  initQueueComplete: getAppInitQueueComplete(state),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(RouteConfigProvider);
