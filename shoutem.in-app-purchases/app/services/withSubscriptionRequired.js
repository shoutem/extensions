import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import _ from 'lodash';
import { getExtensionSettings } from 'shoutem.application';
import {
  withIsFocused,
  FocusTriggerBase,
  navigateTo,
  NavigationStacks,
} from 'shoutem.navigation';
import { selectors } from '../redux';
import { ext } from '../const';

function isShortcutProtected(route) {
  return _.get(
    route,
    ['params', 'shortcut', 'settings', _.camelCase(ext()), 'protected'],
    false,
  );
}

export function withSubscriptionRequired(WrappedComponent) {
  class SubscriptionComponent extends FocusTriggerBase {
    static propTypes = {
      ...FocusTriggerBase.propTypes,
      route: PropTypes.object,
      allScreensProtected: PropTypes.bool,
      isSubscribed: PropTypes.bool,
      isSubscriptionRequired: PropTypes.bool,
      hasProperConfiguration: PropTypes.bool,
    };

    handleFocus() {
      const {
        route,
        isSubscribed,
        isSubscriptionRequired,
        hasProperConfiguration,
        allScreensProtected,
      } = this.props;

      const shouldPromptForSubscription =
        isShortcutProtected(route) || allScreensProtected;

      if (
        shouldPromptForSubscription &&
        !isSubscribed &&
        isSubscriptionRequired &&
        hasProperConfiguration
      ) {
        const previousRoute = _.get(route, 'params.previousRoute');

        NavigationStacks.openStack(ext(), {
          canGoBack: !!previousRoute,
          onCancel: () =>
            navigateTo(previousRoute.name, {
              ...previousRoute.params,
            }),
          onSubscriptionObtained: () => NavigationStacks.closeStack(ext()),
        });
      }
    }

    render() {
      return <WrappedComponent {...this.props} />;
    }
  }

  const mapStateToProps = state => ({
    isSubscribed: selectors.isSubscribed(state),
    isSubscriptionRequired: selectors.isSubscriptionRequired(state),
    hasProperConfiguration: selectors.hasProperConfiguration(state),
    allScreensProtected: _.get(
      getExtensionSettings(state, ext()),
      'allScreensProtected',
      false,
    ),
  });

  const resolvedMapStateToProps = FocusTriggerBase.createMapStateToProps(
    mapStateToProps,
  );

  const ResultComponent = connect(resolvedMapStateToProps)(
    SubscriptionComponent,
  );

  return withIsFocused(ResultComponent);
}
