import { ext } from '../const';

export function getChecklists(state) {
  return state[ext()].allChecklists;
}

export function getChecklistStatuses(state) {
  return state[ext()].checklistStatuses;
}

export function getSubmittedChecklists(state) {
  const checklistStatuses = getChecklistStatuses(state);

  return checklistStatuses.submittedChecklists || [];
}
