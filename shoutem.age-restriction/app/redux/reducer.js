import { REHYDRATE } from 'redux-persist/constants';
import { ext } from '../const';
import { SET_VERIFICATION_COMPLETED } from './actions';

const INITIAL_STATE = {
  completed: false,
};

export default function ageVerificationReducer(state = INITIAL_STATE, action) {
  const { type, payload } = action;

  if (action === REHYDRATE) {
    return { ...payload?.[ext()] };
  }

  if (type === SET_VERIFICATION_COMPLETED) {
    return { ...state, completed: true };
  }

  return state;
}
