import { combineReducers } from 'redux';
import { preventStateRehydration } from 'shoutem.redux';
import { QUEUE_NOTIFICATION, CLEAR_NOTIFICATION_QUEUE } from './actions';

const notificationQueue = (state = null, action) => {
  if (action.type === QUEUE_NOTIFICATION) {
    return action.payload;
  }

  if (action.type === CLEAR_NOTIFICATION_QUEUE) {
    return null;
  }

  return state;
};

export default preventStateRehydration(
  combineReducers({
    notificationQueue,
  }),
);
