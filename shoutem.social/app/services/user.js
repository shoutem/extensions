import _ from 'lodash';
import { loadUser, openProfile } from '../redux/actions';

// TODO - refactor this to be proper, thunked action
// https://fiveminutes.jira.com/browse/SEEXT-11570
export function openProfileForLegacyUser(dispatch) {
  return legacyUser => {
    // This function is called either from auth or social.
    // If it's called from auth we use legacyId and if it's called from social we use id.
    const id = legacyUser.legacyId || legacyUser.id;

    return dispatch(loadUser(`legacyUser:${id}`)).then(user => {
      const fetchedUser = user.payload.data;
      const unpackedUser = {
        id: fetchedUser.id,
        ...fetchedUser.attributes,
        realm: {
          ..._.get(fetchedUser, 'relationships.realm.data'),
        },
      };

      return dispatch(openProfile(unpackedUser));
    });
  };
}

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
