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
    const startedChecklists = state?.startedChecklists || [];
    const shortcutId = action.payload.shortcutId;
    const newStartedChecklists = [...startedChecklists];

    if (!startedChecklists.includes(shortcutId)) {
      newStartedChecklists.push(shortcutId);
    }

    return {
      ...state,
      ...action.payload.statuses,
      startedChecklists: newStartedChecklists,
    };
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
