import _ from 'lodash';

import { openProfile } from 'shoutem.auth';

import { loadUser } from '../redux';

export function adaptSocialUserForProfileScreen(user) {
  const id = _.get(user, 'id', -1);

  return {
    id: _.toString(id),
    legacyId: parseInt(id, 10),
    profile: {
      firstName: _.get(user, 'first_name', ''),
      lastName: _.get(user, 'last_name', ''),
      nickname: _.get(user, 'screen_name', ''),
      image: _.get(user, 'profile_image_url', ''),
    },
    username: _.get(user, 'email', ''),
  };
}

export function adaptUserForSocialActions(user) {
  const legacyId = _.get(user, 'legacyId', -1);
  const first_name = _.get(user, 'profile.firstName', '');
  const last_name = _.get(user, 'profile.lastName', '');

  return {
    id: parseInt(legacyId, 10),
    screen_name: _.get(user, 'profile.nickname', ''),
    email: _.get(user, 'profile.username', ''),
    profile_image_url: _.get(user, 'profile.image', ''),
    name: `${first_name} ${last_name}`,
    first_name,
    last_name,
  };
}

export function openProfileForLegacyUser(dispatch) {
  return (legacyUser) => dispatch(loadUser(`legacyUser:${legacyUser.legacyId}`))
  .then((user) => {
    const fetchedUser = user.payload.data;
    const unpackedUser = {
      id: fetchedUser.id,
      ...fetchedUser.attributes,
    };

    return dispatch(openProfile(unpackedUser));
  });
}
