import ShoutemApi from './shoutemApi';
const shoutemApi = new ShoutemApi();

export { shoutemApi };

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
