import { SAVE_JOURNEY_TRIGGERS } from './actions';

const defaultState = {
  triggers: [],
};

export function reducer(state = defaultState, action) {
  const { type } = action;

  if (type === SAVE_JOURNEY_TRIGGERS) {
    return { ...state, triggers: action.payload };
  }

  return state;
}
