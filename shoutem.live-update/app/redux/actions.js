import { find } from '@shoutem/redux-io';
import { ext, LIVE_UPDATE_STATUS_SCHEMA } from '../const';

export const SET_CURRENT_UPDATE_VERSION = ext('SET_CURRENT_UPDATE_VERSION');

export function setCurrentVersion(versionData) {
  return { type: SET_CURRENT_UPDATE_VERSION, payload: versionData };
}

export function fetchLiveUpdateStatus() {
  return find(LIVE_UPDATE_STATUS_SCHEMA);
}
