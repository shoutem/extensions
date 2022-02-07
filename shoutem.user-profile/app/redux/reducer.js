import _ from 'lodash';
import { preventStateRehydration } from 'shoutem.redux';
import { SET_PROFILE_SCHEMA } from './actions';

function reducer(state = {}, action) {
  if (action.type === SET_PROFILE_SCHEMA) {
    const { payload } = action;

    if (_.isEmpty(payload)) {
      return state;
    }

    return { ...state, ...payload };
  }

  return state;
}

export default preventStateRehydration(reducer);
