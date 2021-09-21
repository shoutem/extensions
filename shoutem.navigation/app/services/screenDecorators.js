const Decorators = [];

export function registerDecorator(decorator) {
  if (!decorator) {
    return;
  }

  Decorators.push(decorator);
}

export function getDecorators() {
  return Decorators;
}

export default {
  registerDecorator,
  getDecorators,
};
