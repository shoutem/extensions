import { REHYDRATE } from 'redux-persist/constants';
import createActionBuffer from 'redux-action-buffer';
import { priorities, before, setPriority } from '@shoutem/core/middlewareUtils';

// Action Buffer prevents actions executions before rehydration
export default [
  setPriority(createActionBuffer(REHYDRATE), before(priorities.INIT)),
  //createActionBuffer(REHYDRATE)
];
