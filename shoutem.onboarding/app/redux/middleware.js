import _ from 'lodash';
import { getExtensionSettings } from 'shoutem.application';
import {
  NavigationStacks,
  SET_NAVIGATION_INITIALIZED,
} from 'shoutem.navigation';
import { ext } from '../const';
import { getOnboardingCompleted } from '../redux';

export const showOnboardingMiddleware = store => next => action => {
  if (action.type === SET_NAVIGATION_INITIALIZED) {
    const state = store.getState();
    const extensionSettings = getExtensionSettings(state, ext());
    const isOnboardingConfigured = !_.isEmpty(
      _.get(extensionSettings, 'pageSettings'),
    );
    const isOnboardingCompleted = getOnboardingCompleted(state);

    const shouldDisplayOnboarding =
      isOnboardingConfigured && !isOnboardingCompleted;

    if (shouldDisplayOnboarding) {
      NavigationStacks.openStack(ext(), {
        onCompleted: () => NavigationStacks.closeStack(ext()),
      });
    }
  }

  return next(action);
};
