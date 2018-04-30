import { Platform } from 'react-native';
import _ from 'lodash';
import { priorities, setPriority, after } from '@shoutem/core/middlewareUtils';
import { NAVIGATE } from '@shoutem/core/navigation'
import { ext } from '../const';

/**
 * Number of miliseconds we will wait before allowing the same navigation action
 * to be dispatched again. Default debounce for iOS is 1000ms, and default for 
 * Android is 3000ms. Values are experimental.
 */
const DEBOUNCE_THRESHOLD = Platform.OS === 'ios' ? 1000 : 3000; 

/**
 * Stores information about the last navigation action:
 * - action which was invoked
 * - timestamp of invoked action
 */
let previousActionContext = {
  action: null,
  timestamp: null,
};

/**
 * Lodash equality customizer for checking the equality of navigation actions.
 * We consider navigation actions equal if all action properties are the same,
 * except function references (which we are ignoring)
 * @param {*} objValue 
 * @param {*} othValue 
 */
function isNavigationActionEqualCustomizer(objValue, othValue) {
  if (_.isFunction(objValue) && _.isFunction(othValue)) {
    return true;
  }

  // makes a default comparison
  return undefined;
}

/**
 * Calculates whether the provided action should be canceled
 * @param {*} actionContext Contains action along with its timestamp
 */
function shouldDebounceAction(actionContext) {
  const { action: previousAction, timestamp: previousTimestamp } = previousActionContext;
  const { action: currentAction, timestamp: currentTimestamp } = actionContext; 

  // don't debounce initial action
  if (_.isEmpty(previousActionContext)) {
    return false;
  }

  // don't debounce if previous action has already expired 
  const hasLastActionExpired = (currentTimestamp - previousTimestamp) > DEBOUNCE_THRESHOLD;
  if (hasLastActionExpired) {
    return false;
  }

  // if action hasn't expired, check if it's deep equal with previous action
  // also, ignore the key property, it's designed to be unique for each dispatch
  return _.isEqualWith(
    _.omit(previousAction, ['route.key']),
    _.omit(currentAction, ['route.key']),
    isNavigationActionEqualCustomizer
  );
}

/**
 * Debounces too many equal navigation actions at the same time.
 * Used to prevent multiple navigations to the same screen.  
 */
export const debounceNavigationMiddleware = 
  setPriority(store => next => action => {
    // we're only interested in debouncing navigation actions
    if (action.type !== NAVIGATE) {
      return next(action);
    }

    const newActionContext = {
      action, 
      timestamp: +new Date(),
    };

    const shouldDebounce = shouldDebounceAction(newActionContext);
    if (shouldDebounce) {
      console.log(`[${ext()}] - DEBOUNCED`, action);
      // by returning without next we're ignoring the action
      return;
    }

    previousActionContext = newActionContext;

    return next(action);
  },
  // this middleware should run after navigation action
  // we want to give oportunity to navigation middlewares to 
  // act upon navigation action normally and then inspect them afterwards
  after(priorities.NAVIGATION)
);
