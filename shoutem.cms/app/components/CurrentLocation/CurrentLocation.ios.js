import React from 'react';
import { connect } from 'react-redux';
import { Linking } from 'react-native';
import CurrentLocationBase from './CurrentLocationBase';

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
      const alert = 'You disabled location permissions for this application.' +
        'Do you want to enable it in' +
        ' settings now?';
      const confirmationMessage = 'Settings';

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
