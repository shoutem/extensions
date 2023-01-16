import React from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { getExtensionSettings } from 'shoutem.application';
import {
  FocusTriggerBase,
  navigateTo,
  NavigationStacks,
  withIsFocused,
} from 'shoutem.navigation';
import { ext } from './const';
import { isAuthenticated, loginInitialized } from './redux';

// function that decorates given Screen with loginRequired property
// Screen decorated with that property should first open LoginScreen if user isn't logged in
export function loginRequired(Screen, value = true) {
  // eslint-disable-next-line no-param-reassign
  Screen.loginRequired = value;
  return Screen;
}

function isShortcutProtected(route) {
  return _.get(route, 'params.shortcut.settings.shoutemAuth.protected', false);
}

// Decorates every screen with the authentiaction check, providing
// login/register redirection for the screens that define that behaviour through
// manual declaration or builder configuration
export function withLoginRequired(WrappedComponent) {
  class AuthComponent extends FocusTriggerBase {
    static propTypes = {
      ...FocusTriggerBase.propTypes,
      allScreensProtected: PropTypes.bool,
      isAuthenticated: PropTypes.bool,
      route: PropTypes.object,
    };

    handleFocus() {
      const {
        route,
        isAuthenticated,
        allScreensProtected,
        loginInitialized,
      } = this.props;

      const screenProtected =
        WrappedComponent.loginRequired !== false &&
        (isShortcutProtected(route) ||
          WrappedComponent.loginRequired ||
          allScreensProtected);

      if (screenProtected && !isAuthenticated) {
        const previousRoute = _.get(route, 'params.previousRoute');

        const onCancel = () =>
          NavigationStacks.closeStack(ext(), () =>
            navigateTo({
              key: previousRoute.key,
              ...previousRoute.params,
            }),
          );

        loginInitialized({
          openAuthFlow: () =>
            NavigationStacks.openStack(ext(), {
              onLoginSuccess: () => NavigationStacks.closeStack(ext()),
              onCancel,
              onBack: onCancel,
              canGoBack: !!previousRoute,
            }),
          loginSuccessCallback: undefined,
          onCancel: () =>
            navigateTo(previousRoute.name, {
              ...previousRoute.params,
            }),
          canGoBack: !!previousRoute,
        });
      }
    }

    render() {
      return <WrappedComponent {...this.props} />;
    }
  }

  const mapStateToProps = state => ({
    isAuthenticated: isAuthenticated(state),
    allScreensProtected: _.get(
      getExtensionSettings(state, ext()),
      'allScreensProtected',
      false,
    ),
  });

  const mapDispatchToProps = {
    loginInitialized,
  };

  const resolvedMapStateToProps = FocusTriggerBase.createMapStateToProps(
    mapStateToProps,
  );

  const ResultComponent = connect(
    resolvedMapStateToProps,
    mapDispatchToProps,
  )(AuthComponent);

  return withIsFocused(ResultComponent);
}
