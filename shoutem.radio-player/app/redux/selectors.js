import _ from 'lodash';
import { createSelector } from 'reselect';
import { ext } from '../const';

function getModuleState(state) {
  return state[ext()];
}

export const getRadioMetadata = createSelector(
  [getModuleState, (_state, id) => id],
  (moduleState, id) => _.get(moduleState, ['radioMetadata', id], {}),
);
