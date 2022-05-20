import { CommonActions } from '@react-navigation/native';
import _ from 'lodash';
import { MODAL, navigationRef } from '../const';
import { getCurrentRoute, navigateTo } from './commonActions';

const RegisteredNavigationStacks = [];
let openStacks = [];

export function getRegisteredStacks() {
  return RegisteredNavigationStacks;
}

export function registerNavigationStack(config) {
  const {
    name,
    NavigationStack,
    screens,
    screenOptions,
    navigatorOptions,
    rootStack = true,
  } = config;

  RegisteredNavigationStacks.push({
    name,
    isRootStack: rootStack,
    stack: {
      NavigationStack,
      screens,
      screenOptions,
      navigatorOptions,
    },
  });
}

export function removeNavigationStack(stackName) {
  _.remove(RegisteredNavigationStacks, stack => stack.name === stackName);
}

export function openStack(stackName, params = {}, initialRoute = null) {
  const matchingStack = _.find(RegisteredNavigationStacks, { name: stackName });

  if (stackName !== MODAL && !matchingStack) {
    throw new Error(`Stack with name ${stackName} is not registered`);
  }

  const stackOpen = _.find(openStacks, { name: stackName });

  if (!stackOpen) {
    openStacks = [
      ...openStacks,
      {
        name: stackName,
        previousRoute: getCurrentRoute(),
      },
    ];
  }

  const defaultScreen = _.get(
    matchingStack,
    'stack.navigatorOptions.initialRouteName',
  );
  const firstScreen = _.get(matchingStack, 'stack.screens[0].name');
  const resolvedRoute = initialRoute || defaultScreen || firstScreen;

  navigateTo(stackName, {
    screen: resolvedRoute,
    params,
  });
}

export function closeStack(stackName, navigationAction) {
  const matchingStack = _.find(openStacks, { name: stackName });

  if (!matchingStack) {
    console.warn('Unable to find matching stack to close. Ignoring');
    return;
  }

  const resolvedAction =
    navigationAction ||
    (() =>
      navigationRef.current?.dispatch(
        CommonActions.navigate({
          key: matchingStack.previousRoute.key,
          params: matchingStack.previousRoute.params,
        }),
      ));

  resolvedAction();

  _.remove(openStacks, { name: stackName });
}

export default {
  getRegisteredStacks,
  registerNavigationStack,
  removeNavigationStack,
  openStack,
  closeStack,
};
