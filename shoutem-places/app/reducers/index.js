import { storage } from '@shoutem/redux-io';
import { combineReducers } from 'redux';
import { cmsCollection } from 'shoutem.cms';
import { ext } from '../const';

export const UPDATE_LOCATION_PERMISSION = 'shoutem.places.UPDATE_LOCATION_PERMISSION';
export const UPDATE_SECOND_PROMPT = 'shoutem.places.UPDATE_SECOND_PROMPT';
export const PermissionStatus = { APPROVED: 'approved', DENIED: 'denied' };


export const updateLocationPermission = (permission) => {
  return { type: UPDATE_LOCATION_PERMISSION, permission };
};

export const updateSecondPromptStatus = (secondPrompt) => {
  return { type: UPDATE_SECOND_PROMPT, secondPrompt };
};

const initialPermissionState = {
  permission: undefined,
  secondPrompt: false,
};

export const permissionStatus = (state = initialPermissionState, action) => {
  const { type, permission, secondPrompt } = action;

  switch (type) {
    case UPDATE_LOCATION_PERMISSION:
      return { ...state, permission };
    case UPDATE_SECOND_PROMPT:
      return { ...state, secondPrompt };
    default: return state;
  }
};

export default combineReducers({
  places: storage(ext('places')),
  allPlaces: cmsCollection(ext('places')),
  permissionStatus,
});
