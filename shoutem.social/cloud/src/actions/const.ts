export const ACTIONS_LOCALS_PATH = 'actions';

export interface Status {
  id: string;
}

export enum SOCIAL_ACTION_TYPES {
  LIKE = 'LIKE',
  COMMENT = 'COMMENT'
};

export enum SOCIAL_NOTIFICATION_TYPES {
  LIKE = 'ShoutLike',
  COMMENT = 'ShoutComment'
}

export enum NOTIFICATION_TITLES {
  LIKE = ' liked your status',
  COMMENT = ' commented on your status'
}
