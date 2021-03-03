export const ACTIONS_LOCALS_PATH = 'actions';

export interface Status {
  id: string;
}

export enum SOCIAL_ACTION_TYPES {
  LIKE = 'LIKE',
  COMMENT = 'COMMENT'
};

export enum NOTIFICATION_TITLES {
  LIKE = ' liked your status',
  COMMENT = ' commented on your status'
}
