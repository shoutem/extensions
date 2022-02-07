import _ from 'lodash';
import { combineReducers } from 'redux';
import { preventStateRehydration } from 'shoutem.redux';
import { REMOVE_TRACK_METADATA, SET_TRACK_METADATA } from './actions';

const trackMetadata = (state = {}, action) => {
  if (action.type === SET_TRACK_METADATA) {
    return { ...state, [action.payload.id]: action.payload.metadata };
  }

  if (action.type === REMOVE_TRACK_METADATA) {
    const newState = { ...state };

    return _.omit(newState, [action.payload]);
  }

  return state;
};

export default preventStateRehydration(
  combineReducers({
    trackMetadata,
  }),
);
