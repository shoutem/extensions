import React from 'react';
import { connect } from 'react-redux';
import {
  Linking,
  AppState,
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
    this.openAppSettings = this.openAppSettings.bind(this);
    this.promptForLocationPermission = this.promptForLocationPermission.bind(this);
    this.handleAppStateChange = this.handleAppStateChange.bind(this);
    this.state = {
      ...this.state,
      schema: ext('places'),
      renderCategoriesInline: true,
      mapView: false,
      currentAppState: undefined,
      currentLocation: null,
    };
  }

  componentDidMount() {
    AppState.addEventListener('change', this.handleAppStateChange);
  }

  componentWillUnmount() {
    AppState.removeEventListener('change', this.handleAppStateChange);
  }

  handleAppStateChange(appState) {
    const { currentAppState } = this.state;

    this.setState({ currentAppState: appState });

    if (currentAppState === 'background' && appState === 'active') {
      this.checkPermissionStatus();
    }
  }

  openAppSettings() {
    Linking.openURL('app-settings:');
  }

  promptForLocationPermission() {
    const alert = 'You disabled location permissions for this application.' +
    'Do you want to enable it in' +
      ' settings now?';
    const confirmationMessage = 'Go to settings';

    super.promptForLocationPermission(alert, confirmationMessage, this.openAppSettings);
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
