import _ from 'lodash';
import { ext } from '../const';

function getModuleState(state) {
  return state[ext()];
}

export function getUserCurrentLocation(state) {
  return _.get(getModuleState(state), ['userCurrentLocation']);
}

export default {
  getUserCurrentLocation,
};
