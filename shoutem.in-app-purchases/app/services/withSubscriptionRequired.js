import React from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { getExtensionSettings } from 'shoutem.application';
import {
  FocusTriggerBase,
  getRouteParams,
  navigateTo,
  NavigationStacks,
  withIsFocused,
} from 'shoutem.navigation';
import { ext } from '../const';
import { selectors } from '../redux';

function isShortcutProtected(route) {
  return _.get(
    route,
    ['params', 'shortcut', 'settings', _.camelCase(ext()), 'protected'],
    false,
  );
}

export function withSubscriptionRequired(WrappedComponent) {
  class SubscriptionComponent extends FocusTriggerBase {
    handleFocus() {
      const {
        route,
        isSubscribed,
        isSubscriptionRequired,
        hasProperConfiguration,
        allScreensProtected,
      } = this.props;
      const { skipSubscriptionPrompt } = getRouteParams(this.props);

      const shouldPromptForSubscription =
        !skipSubscriptionPrompt &&
        (isShortcutProtected(route) || allScreensProtected);

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

  SubscriptionComponent.propTypes = {
    ...FocusTriggerBase.propTypes,
    allScreensProtected: PropTypes.bool.isRequired,
    hasProperConfiguration: PropTypes.bool.isRequired,
    isSubscribed: PropTypes.bool.isRequired,
    isSubscriptionRequired: PropTypes.bool.isRequired,
    route: PropTypes.object.isRequired,
  };

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
