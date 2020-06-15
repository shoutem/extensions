import reducer from './reducers';
import { getUsers } from './selectors';
import * as actions from './actions';
import {
  loadStatuses,
  deleteStatus,
  createStatus,
  likeStatus,
  unlikeStatus,
  invalidateSocialCollections,
  loadComments,
  deleteComment,
  createComment,
  loadUsers,
  loadUser,
} from './actions';

export {
  loadStatuses,
  deleteStatus,
  createStatus,
  likeStatus,
  unlikeStatus,
  invalidateSocialCollections,
  loadComments,
  deleteComment,
  createComment,
  loadUsers,
  loadUser,
};

export {
  collectionStatusMiddleware,
} from './middleware';

export default reducer;

export const selectors = { getUsers };
export { actions };
