import { CommonActions } from '@react-navigation/native';
import _ from 'lodash';
import { MODAL, navigationRef } from '../const';
import { closeStack, openStack } from './navigationStacks';

const ModalScreens = [];

export function getModalScreens() {
  return ModalScreens;
}

export function registerModalScreens(screens) {
  if (_.isEmpty(screens) || !screens) {
    return;
  }

  _.forEach(screens, screen => {
    if (_.isObject(screen) && !screen.name) {
      throw new Error(
        `Attempted to register invalid modal screen with configuration: ${JSON.stringify(
          screen,
        )}`,
      );
    }

    const screenName = _.isObject(screen) ? screen.name : screen;
    const existingScreen = _.find(ModalScreens, { name: screenName });

    if (existingScreen) {
      return;
    }

    const resolvedScreen = _.isObject(screen) ? screen : { name: screen };

    ModalScreens.push(resolvedScreen);
  });
}

export function openInModal(screen, params) {
  const registeredScreen = _.find(ModalScreens, { name: screen });

  if (!registeredScreen) {
    // eslint-disable-next-line no-console
    console.warn(
      'Attempting to navigate to modal screen that is not registered',
    );
    return;
  }

  openStack(MODAL, { ...params }, screen);
}

function closeModalAction(modalStack) {
  navigationRef.current?.dispatch(
    CommonActions.navigate({
      key: modalStack.previousRoute.key,
      params: modalStack.previousRoute.params,
    }),
  );
}

export function closeModal() {
  closeStack(MODAL, closeModalAction);
}

export default {
  registerModalScreens,
  getModalScreens,
};
