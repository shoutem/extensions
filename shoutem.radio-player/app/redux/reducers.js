import _ from 'lodash';
import { combineReducers } from 'redux';
import { preventStateRehydration } from 'shoutem.redux';
import { REMOVE_RADIO_METADATA, SET_RADIO_METADATA } from './actions';

const radioMetadata = (state = {}, action) => {
  if (action.type === SET_RADIO_METADATA) {
    const { id, metadata } = action.payload;

    return { ...state, [id]: { ...state[id], ...metadata } };
  }

  if (action.type === REMOVE_RADIO_METADATA) {
    const newState = { ...state };

    return _.omit(newState, [action.payload]);
  }

  return state;
};

export default preventStateRehydration(
  combineReducers({
    radioMetadata,
  }),
);
