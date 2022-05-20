import React from 'react';
import { connect } from 'react-redux';
import autoBindReact from 'auto-bind/react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { getExtensionSettings } from 'shoutem.application';
import {
  FocusTriggerBase,
  navigateTo,
  NavigationStacks,
  withIsFocused,
} from 'shoutem.navigation';
import { ext } from '../const';
import { selectors } from '../redux';

function isShortcutRestricted(route) {
  return _.get(
    route,
    ['params', 'shortcut', 'settings', _.camelCase(ext()), 'restricted'],
    false,
  );
}

export function withGeoLocationRequired(WrappedComponent) {
  class GeoRestrictionComponent extends FocusTriggerBase {
    static propTypes = {
      ...FocusTriggerBase.propTypes,
      route: PropTypes.object,
    };

    constructor(props) {
      super(props);

      autoBindReact(this);

      this.state = {
        restricted: null,
      };
    }

    handleFocus() {
      const { extensionSettings, route, userCurrentLocation } = this.props;

      const userState = _.get(userCurrentLocation, 'state');
      const missingPermissions = _.get(
        userCurrentLocation,
        'missingPermissions',
      );
      const allowedStates = _.get(extensionSettings, 'allowedStates');
      const geoRestrictionsEnabled = _.get(
        extensionSettings,
        'geoRestrictionsEnabled',
      );

      const isUserLocationRestricted =
        (userState && _.indexOf(allowedStates, userState) === -1) ||
        missingPermissions;
      const isScreenRestricted = isShortcutRestricted(route);

      if (
        geoRestrictionsEnabled &&
        isUserLocationRestricted &&
        isScreenRestricted
      ) {
        const previousRoute = _.get(route, 'params.previousRoute');
        const handleBackAction = () => {
          NavigationStacks.closeStack(ext(), () =>
            navigateTo(previousRoute.name, {
              ...previousRoute.params,
            }),
          );
        };

        return NavigationStacks.openStack(ext(), {
          onCancel: handleBackAction,
          onBack: handleBackAction,
          canGoBack: !!previousRoute,
        });
      }

      return null;
    }

    render() {
      return <WrappedComponent {...this.props} />;
    }
  }

  const mapStateToProps = state => ({
    extensionSettings: getExtensionSettings(state, ext()),
    userCurrentLocation: selectors.getUserCurrentLocation(state),
  });

  const resolvedMapStateToProps = FocusTriggerBase.createMapStateToProps(
    mapStateToProps,
  );

  const ResultComponent = connect(resolvedMapStateToProps)(
    GeoRestrictionComponent,
  );

  return withIsFocused(ResultComponent);
}
