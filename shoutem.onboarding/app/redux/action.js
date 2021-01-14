import { ext } from '../const';

export const ONBOARDING_FINISHED = ext('ONBOARDING_FINISHED');

export const setOnboardingCompleted = () => ({
  type: ONBOARDING_FINISHED,
});
