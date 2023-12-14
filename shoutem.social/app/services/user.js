import _ from 'lodash';
import { loadUser, openProfile } from '../redux/actions';

/**
 * Social user objects are from our .NET. Given user's legacyId, fetch
 * Mongo user object and open profile screen showing retrieved user data.
 *
 * @param {*} legacyUserId
 * @returns
 */
export function openProfileForLegacyUser(legacyUserId) {
  return dispatch => {
    // Dispatch the loadUser action and handle the promise
    return dispatch(loadUser(`legacyUser:${legacyUserId}`)).then(user => {
      const fetchedUser = user.payload.data;
      const unpackedUser = {
        id: fetchedUser.id,
        ...fetchedUser.attributes,
        realm: {
          ..._.get(fetchedUser, 'relationships.realm.data'),
        },
      };

      // Dispatch the openProfile action with the unpackedUser
      dispatch(openProfile(unpackedUser));
    });
  };
}

export function adaptSocialUserForProfileScreen(user) {
  const id = _.get(user, 'id', -1);

  return {
    id: _.toString(id),
    legacyId: parseInt(id, 10),
    profile: {
      nick: _.get(user, 'first_name', ''),
      image: _.get(user, 'profile_image_url', ''),
    },
  };
}
