import { createSelector } from 'reselect';
import { getExtensionSettings } from 'shoutem.application';
import { isPreviewApp } from 'shoutem.preview';
import { images } from '../assets';
import { ext } from '../const';

function getExtensionState(state) {
  return state[ext()];
}

export const getAgeVerificationCompleted = createSelector(
  [getExtensionState],
  state => state.completed,
);

export function getBackgroundImage(state) {
  const settings = getExtensionSettings(state, ext());

  return isPreviewApp
    ? { uri: settings.backgroundImage }
    : images.backgroundImage;
}
