import { combineReducers } from 'redux';
import { ONBOARDING_FINISHED } from './action';

export const onboardingCompletedReducer = (state = false, action) => {
  if (action.type === ONBOARDING_FINISHED) {
    return true;
  }

  return state;
}

export default combineReducers({
  onboardingCompleted: onboardingCompletedReducer,
});
