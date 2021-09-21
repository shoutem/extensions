import _ from 'lodash';
import { ext } from '../const';

function getModuleState(state) {
  return state[ext()];
}

export function getTrackMetadata(id, state) {
  const metadataState = _.get(getModuleState(state), 'trackMetadata');

  return metadataState[id];
}
