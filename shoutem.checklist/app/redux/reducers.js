import { combineReducers } from 'redux';
import { cmsCollection } from 'shoutem.cms';
import { REHYDRATE } from 'redux-persist/constants';
import { storage } from '@shoutem/redux-io';
import { ext } from '../const';
import { SET_CHECKLIST_STATUSES, SUBMIT_CHECKLIST } from './actions';

export function checklistStatuses(state = {}, action) {
  if (action.type === REHYDRATE) {
    return { ...action?.payload?.[ext()]?.checklistStatuses };
  }

  if (action.type === SET_CHECKLIST_STATUSES) {
    return { ...state, ...action.payload.statuses };
  }

  if (action.type === SUBMIT_CHECKLIST) {
    const submittedChecklists = state?.submittedChecklists || [];
    const newSubmittedChecklists = [
      ...submittedChecklists,
      action.payload.shortcutId,
    ];

    return { ...state, submittedChecklists: newSubmittedChecklists };
  }

  return state;
}

export default combineReducers({
  allChecklists: cmsCollection(ext('checklists')),
  checklists: storage(ext('checklists')),
  checklistStatuses,
});
