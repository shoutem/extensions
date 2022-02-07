import hoistNonReactStatics from 'hoist-non-react-statics';
import _ from 'lodash';

const Decorators = [];
let GlobalDecorator = null;

export function registerDecorator(decorator) {
  if (!decorator) {
    return;
  }

  Decorators.push(decorator);
}

export function getDecorators() {
  return Decorators;
}

export function getGlobalDecorator() {
  return GlobalDecorator;
}

// Collect all registered screen decorators and
// create one that holds all of the logic, that
// will be applied to each screen contained in any child navigator
export function createGlobalDecorator() {
  const decorators = getDecorators();

  GlobalDecorator = _.reduce(
    decorators,
    (result, decorator) => {
      return screen => hoistNonReactStatics(decorator(result(screen)), screen);
    },
    screen => screen,
  );
}

export function decorateScreens(screens) {
  if (!GlobalDecorator) {
    throw new Error(
      `GlobalDecorator was not created. Please call createGlobalDecorator() first.`,
    );
  }
  return _.reduce(
    screens,
    (result, screen, name) => ({
      ...result,
      [name]: GlobalDecorator(screen),
    }),
    {},
  );
}

export default {
  createGlobalDecorator,
  decorateScreens,
  registerDecorator,
  getDecorators,
  getGlobalDecorator,
};
