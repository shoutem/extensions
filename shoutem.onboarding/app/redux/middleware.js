import _ from 'lodash';
import { getExtensionSettings } from 'shoutem.application';
import {
  NavigationStacks,
  SET_NAVIGATION_INITIALIZED,
} from 'shoutem.navigation';
import { ext } from '../const';
import { ONBOARDING_FINISHED } from './action';
import { getOnboardingCompleted } from './selector';

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
        onOnboardingCompleted: () => NavigationStacks.closeStack(ext()),
      });
    }
  }

  return next(action);
};

export const completeOnboardingMiddleware = () => next => action => {
  if (action.type === ONBOARDING_FINISHED) {
    const { onOnboardingCompleted } = action.payload;

    onOnboardingCompleted();
  }

  return next(action);
};
