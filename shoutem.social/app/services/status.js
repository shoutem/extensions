import _ from 'lodash';

export function increaseNumberOfComments(statuses, statusId) {
  return _.map(statuses, status => {
    const { id, shoutem_reply_count: replyCount } = status;

    if (id === statusId) {
      return {
        ...status,
        shoutem_reply_count: replyCount + 1,
      };
    }

    return status;
  });
}

export function decreaseNumberOfComments(statuses, statusId) {
  return _.map(statuses, status => {
    const { id, shoutem_reply_count: replyCount } = status;

    if (id === statusId) {
      return {
        ...status,
        shoutem_reply_count: replyCount - 1,
      };
    }

    return status;
  });
}

export function appendStatus(statuses, status, prepend) {
  const newStatus = {
    ...status,
    shoutem_reply_count: 0,
    shoutem_favorited_by: {
      count: 0,
      users: [],
    },
  };

  if (prepend) {
    return [newStatus, ...statuses];
  }

  return [...statuses, newStatus];
}

export function removeStatus(statuses, statusId) {
  return _.reject(statuses, status => status.id === statusId);
}

export function updateStatusesAfterLike(
  statuses,
  statusId,
  user,
  currentlyLiked,
) {
  return _.map(statuses, status => {
    if (status.id === statusId && !status.liked) {
      const usersWhoLike = _.get(status, 'shoutem_favorited_by.users');

      return {
        ...status,
        liked: currentlyLiked,
        shoutem_favorited_by: {
          ...status.shoutem_favorited_by,
          count: status.shoutem_favorited_by.count + 1,
          users: [user, ...usersWhoLike],
        },
      };
    }

    return status;
  });
}

export function updateStatusesAfterUnlike(
  statuses,
  statusId,
  userId,
  currentlyLiked,
) {
  return _.map(statuses, status => {
    if (status.id === statusId && status.liked) {
      const usersWhoLike = _.get(status, 'shoutem_favorited_by.users');

      return {
        ...status,
        liked: currentlyLiked,
        shoutem_favorited_by: {
          ...status.shoutem_favorited_by,
          count: status.shoutem_favorited_by.count - 1,
          users: _.reject(usersWhoLike, { id: userId }),
        },
      };
    }
    return status;
  });
}
