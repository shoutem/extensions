import React, { PureComponent } from 'react';
import { Alert, Platform } from 'react-native';
import { connect } from 'react-redux';
import autoBindReact from 'auto-bind/react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { I18n } from 'shoutem.i18n';
import {
  checkPermissions,
  openSettings,
  PERMISSION_TYPES,
  request,
  requestPermissions,
  RESULTS,
} from 'shoutem.permissions';
import { ext } from '../../const';
import {
  getLocationPermissionStatus,
  PermissionStatus,
  updateLocationPermission,
  updateSecondPromptStatus,
} from '../../redux';

const LOCATION_PERMISSION =
  Platform.OS === 'ios'
    ? PERMISSION_TYPES.IOS_LOCATION_WHEN_IN_USE
    : PERMISSION_TYPES.ANDROID_ACCESS_FINE_LOCATION;

export default function(WrappedComponent) {
  class CurrentLocation extends PureComponent {
    static propTypes = {
      permissionStatus: PropTypes.object,
      updateLocationPermission: PropTypes.func,
      updateSecondPromptStatus: PropTypes.func,
    };

    static mapStateToProps = state => ({
      permissionStatus: getLocationPermissionStatus(state),
    });

    static mapDispatchToProps = dispatch =>
      bindActionCreators(
        {
          updateLocationPermission,
          updateSecondPromptStatus,
        },
        dispatch,
      );

    constructor(props) {
      super(props);

      autoBindReact(this);

      this.state = {
        currentLocation: null,
      };
    }

    updatePermissionIfChanged(permissionGranted) {
      const {
        updateLocationPermission,
        updateSecondPromptStatus,
        permissionStatus,
      } = this.props;
      const { permission, secondPrompt } = permissionStatus;
      const { APPROVED, DENIED } = PermissionStatus;

      const newPermission = permissionGranted ? APPROVED : DENIED;

      if (
        permission === newPermission &&
        !(newPermission === DENIED && !secondPrompt)
      ) {
        return;
      }

      if (
        permission === PermissionStatus.DENIED &&
        newPermission === PermissionStatus.DENIED &&
        !secondPrompt
      ) {
        updateSecondPromptStatus(true);
        this.promptForLocationPermission();
        return;
      }

      updateLocationPermission(newPermission);
      updateSecondPromptStatus(false);
    }

    handleLocationPermissionGranted(currentLocation) {
      this.setState({ currentLocation });
      this.updatePermissionIfChanged(true);
    }

    handleLocationPermissionDenied() {
      this.setState({ currentLocation: null });
      this.updatePermissionIfChanged(false);
    }

    checkPermissionStatus() {
      const {
        permissionStatus: { permission },
      } = this.props;

      checkPermissions(LOCATION_PERMISSION).then(result => {
        const shouldPrompt =
          Platform.OS === 'ios' ? true : _.isUndefined(permission);

        if (result === RESULTS.DENIED) {
          if (shouldPrompt) {
            return requestPermissions(LOCATION_PERMISSION).then(result => {
              if (result[LOCATION_PERMISSION] === RESULTS.GRANTED) {
                return navigator.geolocation.getCurrentPosition(
                  this.handleLocationPermissionGranted,
                  this.handleLocationPermissionDenied,
                );
              }

              this.handleLocationPermissionDenied();
            });
          }

          return this.handleLocationPermissionDenied();
        }

        if (result === RESULTS.GRANTED) {
          return navigator.geolocation.getCurrentPosition(
            this.handleLocationPermissionGranted,
            this.handleLocationPermissionDenied,
          );
        }

        if (result === RESULTS.BLOCKED) {
          return this.handleLocationPermissionDenied();
        }
      });
    }

    requestPermissionAndroid() {
      const rationale = {
        title: I18n.t(ext('androidLocationPermissionTitle')),
        message: I18n.t(ext('androidLocationPermissionMessage')),
      };

      return request(LOCATION_PERMISSION, rationale).then(
        this.checkPermissionStatus,
      );
    }

    promptForLocationPermission() {
      const alertIOS = I18n.t(ext('iosLocationPermissionDisabled'));
      const confirmationMessageIOS = I18n.t(
        ext('iosLocationPermissionSettings'),
      );

      const alertAndroid = I18n.t(ext('androidLocationPermissionDisabled'));
      const confirmationMessageAndroid = I18n.t(
        ext('androidLocationPermissionEnable'),
      );

      const alert = Platform.OS === 'ios' ? alertIOS : alertAndroid;
      const confirmationMessage =
        Platform.OS === 'ios'
          ? confirmationMessageIOS
          : confirmationMessageAndroid;

      const onConfirmation =
        Platform.OS === 'ios' ? openSettings : this.requestPermissionAndroid;

      const confirmOption = {
        text: confirmationMessage,
        onPress: onConfirmation,
      };
      const cancelOption = { text: I18n.t(ext('cancelLocationPermissions')) };
      const alertOptions = [confirmOption, cancelOption];

      Alert.alert(
        I18n.t(ext('locationPermissionsPrompt')),
        alert,
        alertOptions,
      );
    }

    render() {
      const { currentLocation } = this.state;

      return (
        <WrappedComponent
          {...this.props}
          currentLocation={currentLocation}
          checkPermissionStatus={this.checkPermissionStatus}
        />
      );
    }
  }

  return connect(
    CurrentLocation.mapStateToProps,
    CurrentLocation.mapDispatchToProps,
  )(CurrentLocation);
}
