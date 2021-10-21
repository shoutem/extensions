import _ from 'lodash';
import { getExtensionSettings } from 'shoutem.application';
import { ext, MISSING_PERMISSIONS_ERROR } from './const';
import { actions } from './redux';
import { getCurrentLocation, fetchUserAddress } from './services';

function getExtensionState(state) {
  return _.get(state, ext(), {});
}

export function appDidMount(app) {
  const store = app.getStore();
  const state = store.getState();
  const { dispatch } = store;

  const extensionSettings = getExtensionSettings(state, ext());
  const extensionState = getExtensionState(state);
  const { geoRestrictionsEnabled, geocoderApiKey } = extensionSettings;
  const country = _.get(extensionState, 'userCurrentLocation.country');

  if (!geoRestrictionsEnabled || country || !geocoderApiKey) {
    return null;
  }

  return getCurrentLocation()
    .then(currentLocation => {
      const latitude = currentLocation.coords.latitude;
      const longitude = currentLocation.coords.longitude;

      fetchUserAddress(geocoderApiKey, longitude, latitude).then(address => {
        const country = _.get(address, 'Country');
        const userState = _.get(address, 'State');

        return dispatch(
          actions.setUserCurrentLocation({
            country,
            state: userState,
            missingPermissions: false,
          }),
        );
      });
    })
    .catch(error => {
      console.error('Fetching user address failed!', error);
      if (error === MISSING_PERMISSIONS_ERROR) {
        dispatch(
          actions.setUserCurrentLocation({
            country: null,
            state: null,
            missingPermissions: true,
          }),
        );
      }
    });
}
