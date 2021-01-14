import _ from 'lodash';
import { NAVIGATION_INITIALIZED, openInModal } from 'shoutem.navigation';
import { getExtensionSettings } from 'shoutem.application';
import { getOnboardingCompleted } from './selector';
import { ext } from '../const';

export const onboardingMiddleware = store => next => (action) => {
  if (action.type === NAVIGATION_INITIALIZED) {
    const state = store.getState();
    const { dispatch } = store;

    const extensionSettings = getExtensionSettings(state, ext());
    const isOnboardingConfigured = !_.isEmpty(_.get(extensionSettings, 'pageSettings'));
    const isOnboardingCompleted = getOnboardingCompleted(state);
    const shouldDisplayOnboarding = isOnboardingConfigured && !isOnboardingCompleted;

    if (shouldDisplayOnboarding) {
      dispatch(openInModal({
        screen: ext('OnboardingScreen'),
        props: {
          customNavigationBar: true,
        },
      }));
    }
  }
  return next(action);
};
