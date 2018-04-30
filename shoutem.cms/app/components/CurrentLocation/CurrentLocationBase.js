import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { Alert } from 'react-native';
import { I18n } from 'shoutem.i18n';

import { ext } from '../../const';
import {
  PermissionStatus,
  updateLocationPermission,
  updateSecondPromptStatus,
} from '../../reducers';
import {
  getLocationPermissionStatus,
} from '../../redux';

export default class CurrentLocationBase extends Component {
  static propTypes = {
    permissionStatus: PropTypes.object,
    updateLocationPermission: PropTypes.func,
    updateSecondPromptStatus: PropTypes.func,
  };

  static mapStateToProps = (state) => ({
    permissionStatus: getLocationPermissionStatus(state),
  });

  static mapDispatchToProps = (dispatch) => bindActionCreators({
    updateLocationPermission,
    updateSecondPromptStatus,
  }, dispatch);

  constructor(props) {
    super(props);

    this.checkPermissionStatus = this.checkPermissionStatus.bind(this);
    this.promptForLocationPermission = this.promptForLocationPermission.bind(this);
    this.handleLocationPermissionGranted = this.handleLocationPermissionGranted.bind(this);
    this.handleLocationPermissionDenied = this.handleLocationPermissionDenied.bind(this);
    this.updatePermissionIfChanged = this.updatePermissionIfChanged.bind(this);

    this.state = {
      currentLocation: null,
    };
  }

  updatePermissionIfChanged(permissionGranted) {
    const { updateLocationPermission, updateSecondPromptStatus, permissionStatus } = this.props;
    const { permission, secondPrompt } = permissionStatus;
    const { APPROVED, DENIED } = PermissionStatus;

    const newPermission = permissionGranted ? APPROVED : DENIED;

    if (permission === newPermission &&
      !(newPermission === DENIED && !secondPrompt)) {
      return;
    }

    if (permission === PermissionStatus.DENIED && newPermission === PermissionStatus.DENIED && !secondPrompt) {
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
    navigator.geolocation.getCurrentPosition(
      this.handleLocationPermissionGranted,
      this.handleLocationPermissionDenied
    );
  }

  promptForLocationPermission(message, confirmationMessage, onConfirmation) {
    const confirmOption = { text: confirmationMessage, onPress: onConfirmation };
    const cancelOption = { text: I18n.t(ext('cancelLocationPermissions')) };
    const alertOptions = [confirmOption, cancelOption];

    Alert.alert(
      I18n.t(ext('locationPermissionsPrompt')),
      message,
      alertOptions,
    );
  }
}
