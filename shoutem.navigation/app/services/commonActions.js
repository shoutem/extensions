import _ from 'lodash';
import moment from 'moment';
import { navigationRef } from '../const';

const DEBOUNCE_DELAY = 400;

let lastInvocation = null;
let lastScreen = null;

function withDebounce(screen, navAction) {
  if (
    lastInvocation &&
    screen === lastScreen &&
    moment().diff(lastInvocation) <= DEBOUNCE_DELAY
  ) {
    return null;
  }

  if (
    lastInvocation &&
    screen === lastScreen &&
    moment().diff(lastInvocation) > DEBOUNCE_DELAY
  ) {
    lastInvocation = moment();
    return navAction();
  }

  lastScreen = screen;
  lastInvocation = moment();

  return navAction();
}

export function getCurrentRoute() {
  return navigationRef.current?.getCurrentRoute();
}

function resolveNavigationParams(screen, navigationParams) {
  const previousRoute = getCurrentRoute();
  const prevRouteShortcut = _.get(previousRoute, 'params.shortcut');
  const paramsShortcut = _.get(navigationParams, 'shortcut', {});
  const prevShortcut = prevRouteShortcut || paramsShortcut;
  const prevShortcutScreens = _.get(prevShortcut, 'screens');

  const matchingShortcutScreen = _.find(prevShortcutScreens, {
    canonicalType: screen,
  });

  const resolvedScreen = matchingShortcutScreen
    ? matchingShortcutScreen.canonicalName
    : screen;

  if (!navigationParams) {
    return { resolvedScreen, routeParams: { previousRoute } };
  }

  const screenSettings =
    matchingShortcutScreen?.settings || navigationParams?.screenSettings || {};

  const routeParams = {
    ...(_.has(navigationParams, 'params') && {
      ...navigationParams,
      params: {
        ...navigationParams.params,
        previousRoute,
      },
    }),
    ...(!_.has(navigationParams, 'params') && {
      ...navigationParams,
      previousRoute,
      screenSettings,
    }),
  };

  return {
    resolvedScreen,
    routeParams,
  };
}

export function replace(navigation, screen, navigationParams) {
  if (!navigation || !_.isObject(navigation)) {
    // eslint-disable-next-line no-console
    return console.warn(`'navigation' param is missing.`);
  }

  const { resolvedScreen, routeParams } = resolveNavigationParams(
    screen,
    navigationParams,
  );

  if (!_.isFunction(navigation.replace)) {
    // eslint-disable-next-line no-console
    return console.warn(
      `You are trying to use replace function on non-stack navigator`,
    );
  }

  return withDebounce(screen, () =>
    navigation.replace(resolvedScreen, routeParams),
  );
}

export function goBack() {
  navigationRef.current?.goBack();
}

export function navigateTo(screen, navigationParams) {
  const { resolvedScreen, routeParams } = resolveNavigationParams(
    screen,
    navigationParams,
  );

  return withDebounce(screen, () =>
    navigationRef.current?.navigate(resolvedScreen, routeParams),
  );
}

export function push(navigation, screen, navigationParams) {
  if (!navigation || !_.isObject(navigation)) {
    // eslint-disable-next-line no-console
    return console.warn(`'navigation' param is missing.`);
  }

  const { resolvedScreen, routeParams } = resolveNavigationParams(
    screen,
    navigationParams,
  );

  if (!_.isFunction(navigation.replace)) {
    // eslint-disable-next-line no-console
    return console.warn(
      `You are trying to use replace function on non-stack navigator`,
    );
  }

  return withDebounce(screen, () =>
    navigation.push(resolvedScreen, routeParams),
  );
}
