export ShoutemApi, { shoutemApi } from './shoutemApi';

export {
  increaseNumberOfComments,
  decreaseNumberOfComments,
  appendStatus,
  removeStatus,
  updateStatusesAfterLike,
  updateStatusesAfterUnlike,
  formatLikeText,
} from './status';

export {
  adaptUserForSocialActions,
  adaptSocialUserForProfileScreen,
  openProfileForLegacyUser,
} from './user';
