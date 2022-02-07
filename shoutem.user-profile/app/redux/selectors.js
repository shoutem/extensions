import _ from 'lodash';
import { createSelector } from 'reselect';
import {
  getConfiguration,
  getSubscriptionValidState,
} from 'shoutem.application';
import { getUser } from 'shoutem.auth';
import { ext } from '../const';

export const getUserProfileState = state => state[ext()];

export const getUserProfileSchema = createSelector(
  [getUserProfileState, (_state, excludedProperties) => excludedProperties],
  (userProfileSchema, excludedProperties = null) =>
    _.omit(userProfileSchema, excludedProperties),
);

export const isUserProfileOwner = createSelector(
  [getUser, (_state, user) => user],
  (currentUser, user) => {
    return currentUser.id === user.id;
  },
);

export const isUserProfileCompleted = createSelector(
  [getUser, getUserProfileState],
  (user, profileSchema) => {
    if (_.isEmpty(profileSchema)) {
      return true;
    }

    const requiredFields = _.reduce(
      profileSchema,
      (result, value, key) => (value.required ? [...result, key] : result),
      [],
    );
    const userProfile = _.pick(user.profile, requiredFields);

    return _.reduce(
      userProfile,
      (result, value) => result && !!value,
      !_.isEmpty(userProfile),
    );
  },
);

/**
 * Checks whether the SendBird extension is installed and configured.
 * We check this in order to display or hide the chat button within the user
 * profile screen.
 * @param {Object} state App state
 */
export function isSendBirdConfigured(state) {
  const config = getConfiguration(state);
  const hasValidSubscription = getSubscriptionValidState(state);
  const extensionInstalled = _.find(_.get(config, 'extensions'), {
    id: 'shoutem.sendbird',
  });
  const featureActive = _.get(
    extensionInstalled,
    'settings.featureActive',
    false,
  );

  return extensionInstalled && featureActive && hasValidSubscription;
}

/**
 * Checks whether the Agora extension is installed and configured.
 * We check this in order to display or hide the video call button within the user
 * profile screen.
 * @param {Object} state App state
 */
export function isAgoraConfigured(state) {
  const config = getConfiguration(state);
  const extensionInstalled = _.find(_.get(config, 'extensions'), {
    id: 'shoutem.agora',
  });
  const apiKeySet = !_.isEmpty(_.get(extensionInstalled, 'settings.appId', ''));

  return extensionInstalled && apiKeySet;
}
