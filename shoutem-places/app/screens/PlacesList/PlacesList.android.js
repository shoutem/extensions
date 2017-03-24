import React from 'react';
import { connect } from 'react-redux';
import {
  PermissionsAndroid,
} from 'react-native';
import {
  find,
} from '@shoutem/redux-io';
import { navigateTo } from '@shoutem/core/navigation';
import { connectStyle } from '@shoutem/theme';
import { CmsListScreen } from 'shoutem.cms';
import { ext } from '../../const';
import { updateLocationPermission, updateSecondPromptStatus } from '../../reducers';
import { PlacesListBase } from './PlacesListBase';

class PlacesList extends PlacesListBase {
  static createMapStateToProps = CmsListScreen.createMapStateToProps;
  static createMapDispatchToProps = CmsListScreen.createMapDispatchToProps;
  static propTypes = {
    ...PlacesListBase.propTypes,
    updateLocationPermission: React.PropTypes.func,
    updateSecondPromptStatus: React.PropTypes.func,
  }

  constructor(props) {
    super(props);
    this.renderRow = this.renderRow.bind(this);
    this.promptForLocationPermission = this.promptForLocationPermission.bind(this);
    this.checkPermissionStatus = this.checkPermissionStatus.bind(this);
    this.requestPermission = this.requestPermission.bind(this);
    this.state = {
      ...this.state,
      schema: ext('places'),
      renderCategoriesInline: true,
      mapView: false,
      currentLocation: null,
    };
  }

  checkPermissionStatus() {
    const { permission } = this.props.permissionStatus;

    if (permission === undefined) {
      this.requestPermission();
    }
  }

  async requestPermission() {
    try {
      await PermissionsAndroid.requestPermission(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          /* eslint-disable quote-props */
          'title': 'Location Permission',
          'message': 'This app needs access to your location ' +
          'to display relevant data',
          /* eslint-enable quote-props */
        }
      ).then(() => { super.checkPermissionStatus(); });
    } catch (err) {
      console.warn(err);
    }
  }

  promptForLocationPermission() {
    const alert = 'You disabled location permissions for this application.' +
    'Do you want to enable it now?';
    const confirmationMessage = 'Enable';

    super.promptForLocationPermission(alert, confirmationMessage, this.requestPermission);
  }
}

export const mapStateToProps = (state, ownProps) => ({
  ...CmsListScreen.createMapStateToProps(state => state[ext()].allPlaces)(state, ownProps),
  permissionStatus: state[ext()].permissionStatus,
});

export const mapDispatchToProps = CmsListScreen.createMapDispatchToProps({
  navigateTo,
  find,
  updateLocationPermission,
  updateSecondPromptStatus,
});

const StyledPlacesList = connect(mapStateToProps, mapDispatchToProps)(
  connectStyle(ext('PlacesList'))(PlacesList),
);

export {
  StyledPlacesList as PlacesList,
};
