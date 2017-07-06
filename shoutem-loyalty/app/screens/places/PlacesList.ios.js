import React from 'react';
import { connect } from 'react-redux';
import {
  Linking,
  AppState,
} from 'react-native';
import { connectStyle } from '@shoutem/theme';

import { loginRequired } from 'shoutem.auth';
import { CmsListScreen } from 'shoutem.cms';
import { ext } from '../../const';
import { PlacesListBase, mapStateToProps, mapDispatchToProps } from './PlacesListBase';

const openAppSettings = () => {
  Linking.openURL('app-settings:');
};

export class PlacesList extends PlacesListBase {
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

  promptForLocationPermission() {
    const alert = 'You disabled location permissions for this application.' +
    'Do you want to enable it in' +
      ' settings now?';
    const confirmationMessage = 'Settings';

    super.promptForLocationPermission(alert, confirmationMessage, openAppSettings);
  }
}

const StyledPlacesListScreen = loginRequired(connect(mapStateToProps, mapDispatchToProps)(
  connectStyle(ext('PlacesList'))(PlacesList),
));

export {
  StyledPlacesListScreen as PlacesListScreen,
};
