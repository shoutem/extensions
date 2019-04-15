import _ from 'lodash';
import { CALL_API } from 'redux-api-middleware';

import { priorities, setPriority } from 'shoutem-core';

let blockActions = false;
let actionsStack = [];

export const blockActionsMiddleware = setPriority(() => {
  return store => next => action => {
    const actionType = _.get(action, 'type');

    if (action[CALL_API]) {
      return next(action);
    }

    if (actionType === 'BLOCK_ACTIONS') {
      blockActions = true;
      // we do not want to save BLOCK_ACTIONS into actions stack
      // eslint-disable-next-line consistent-return
      return;
    } else if (actionType === 'ALLOW_ACTIONS') {
      blockActions = false;
      let stackedAction;
      stackedAction = actionsStack.pop();
      while (stackedAction) {
        next(stackedAction);
        stackedAction = actionsStack.pop();
      }
    }

    if (blockActions) {
      actionsStack = [action, ...actionsStack];
      // eslint-disable-next-line consistent-return
      return;
    }
    return next(action);
  };
}, priorities.LAST);

const middleware = [];

if (process.env.NODE_ENV === 'development') {
  const createLogger = require('redux-logger');
  const logger = createLogger({
    collapsed: true,
    actionTransformer: (action) => ({
      ...action,
      type: String(action.type),
    }),
  });
  middleware.push(logger);
}

export {
  middleware,
};
