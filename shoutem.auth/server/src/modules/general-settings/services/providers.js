import _ from 'lodash';

function validateRequiredField(value, name = 'Field') {
  if (!value) {
    return `${name} is required`;
  }

  return null;
}

export function validateProviderSetup(providerSetup) {
  return _.reduce(providerSetup, (result, value, key) => ({
    ...result,
    [key]: validateRequiredField(value),
  }), {});
}
