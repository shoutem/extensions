import { ext } from '../const';

function getModuleState(state) {
  return state[ext()];
}

export function getCurrentVersion(state) {
  return getModuleState(state).currentUpdateVersion;
}
