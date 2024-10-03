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
import { isIos } from 'shoutem-core';
import { ext } from '../const';
import { selectors } from '../redux';

function isShortcutProtected(route) {
  return _.get(
    route,
    ['params', 'shortcut', 'settings', _.camelCase(ext()), 'protected'],
    false,
  );
}

function getShortcutProductId(route) {
  const resolvedProductKey = isIos ? 'iOSProductId' : 'androidProductId';

  return _.get(route, [
    'params',
    'shortcut',
    'settings',
    _.camelCase(ext()),
    resolvedProductKey,
  ]);
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
        singularProductPerScreenEnabled,
      } = this.props;
      const { skipSubscriptionPrompt } = getRouteParams(this.props);

      const shouldPromptForSubscription =
        !skipSubscriptionPrompt &&
        (isShortcutProtected(route) ||
          (!singularProductPerScreenEnabled && allScreensProtected));

      if (
        shouldPromptForSubscription &&
        !isSubscribed &&
        isSubscriptionRequired &&
        hasProperConfiguration
      ) {
        const previousRoute = _.get(route, 'params.previousRoute');
        const requiredProductId = singularProductPerScreenEnabled
          ? getShortcutProductId(route)
          : undefined;

        const onCancel = () => {
          NavigationStacks.closeStack(ext(), () =>
            navigateTo({
              key: previousRoute.key,
              ...previousRoute.params,
            }),
          );
        };

        NavigationStacks.openStack(ext(), {
          canGoBack: !!previousRoute,
          onCancel,
          onBack: onCancel,
          onSubscriptionObtained: () => NavigationStacks.closeStack(ext()),
          productId: requiredProductId,
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

  const mapStateToProps = (state, ownProps) => {
    const shortcutProductId = getShortcutProductId(ownProps.route);
    const singularProductPerScreenEnabled = _.get(
      getExtensionSettings(state, ext()),
      'singularProductPerScreenEnabled',
      false,
    );
    const requiredProductId = singularProductPerScreenEnabled
      ? shortcutProductId
      : undefined;
    const hasProperConfiguration = singularProductPerScreenEnabled
      ? !!shortcutProductId
      : selectors.hasProperGlobalConfiguration(state);

    return {
      isSubscribed: selectors.isSubscribed(requiredProductId, state),
      isSubscriptionRequired: selectors.isSubscriptionRequired(state),
      hasProperConfiguration,
      allScreensProtected: _.get(
        getExtensionSettings(state, ext()),
        'allScreensProtected',
        false,
      ),
      singularProductPerScreenEnabled,
    };
  };

  const resolvedMapStateToProps = FocusTriggerBase.createMapStateToProps(
    mapStateToProps,
  );

  const ResultComponent = connect(resolvedMapStateToProps)(
    SubscriptionComponent,
  );

  return withIsFocused(ResultComponent);
}
