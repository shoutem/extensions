import { ext } from '../const';

export const SET_CHECKLIST_STATUSES = ext('SET_CHECKLIST_STATUSES');
export const SUBMIT_CHECKLIST = ext('SUBMIT_CHECKLIST');

export function setChecklistStatuses(statuses, shortcutId) {
  return {
    type: SET_CHECKLIST_STATUSES,
    payload: { statuses, shortcutId },
  };
}

export function submitChecklist(shortcutId) {
  return {
    type: SUBMIT_CHECKLIST,
    payload: { shortcutId },
  };
}
