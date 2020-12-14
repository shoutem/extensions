import _ from 'lodash';

function calculateChanges(newObject, object) {
  return _.transform(newObject, (result, newValue, key) => {
    const value = object[key];

    if (_.isEqual(newValue, value)) {
      return;
    }

    if (_.isObject(newValue) && _.isObject(value)) {
      // eslint-disable-next-line no-param-reassign
      result[key] = calculateChanges(newValue, value);
    }

    // eslint-disable-next-line no-param-reassign
    result[key] = newValue;
  });
}

export function calculateDifferenceObject(newObject, object) {
  return calculateChanges(newObject, object);
}
