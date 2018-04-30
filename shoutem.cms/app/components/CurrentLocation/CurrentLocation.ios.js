import React from 'react';
import { connect } from 'react-redux';
import { Linking } from 'react-native';
import CurrentLocationBase from './CurrentLocationBase';
import { I18n } from 'shoutem.i18n';
import { ext } from '../../const';

export default function (WrappedComponent) {
  class CurrentLocation extends CurrentLocationBase {
    constructor(props) {
      super(props);

      this.promptForLocationPermission = this.promptForLocationPermission.bind(this);
      this.openAppSettings = this.openAppSettings.bind(this);
    }

    openAppSettings() {
      Linking.openURL('app-settings:');
    }

    promptForLocationPermission() {
      const alert = I18n.t(ext('iosLocationPermissionDisabled'));
      const confirmationMessage = I18n.t(ext('iosLocationPermissionSettings'));

      super.promptForLocationPermission(alert, confirmationMessage, this.openAppSettings);
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
    CurrentLocationBase.mapStateToProps,
    CurrentLocationBase.mapDispatchToProps,
  )(CurrentLocation);
}
