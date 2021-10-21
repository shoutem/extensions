export const SET_CURRENT_LOCATION = 'shoutem.geo-restrictions.SET_CURRENT_LOCATION';

export function setUserCurrentLocation(location) {
  return { type: SET_CURRENT_LOCATION, payload: location };
}

export default { setUserCurrentLocation };
