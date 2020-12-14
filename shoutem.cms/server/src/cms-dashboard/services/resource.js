import _ from 'lodash';

function isExternalReference(element) {
  if (_.isArray(element)) {
    return isExternalReference(_.head(element));
  }

  return _.has(element, 'id') && _.has(element, 'type');
}

function transformToExternalReference(element) {
  if (_.isArray(element)) {
    return _.map(element, transformToExternalReference);
  }

  return _.pick(element, ['id', 'type']);
}

export function getResourceRelationships(resource) {
  return _.reduce(
    resource,
    (result, value, key) => {
      if (!isExternalReference(value)) {
        return result;
      }

      return {
        ...result,
        [key]: { data: transformToExternalReference(value) },
      };
    },
    {},
  );
}
