import _ from 'lodash';
import { FIELD_FORMATS } from '../form-builder/services/schemaDefinitions';

export function resolveUserProfileSchema(schema) {
  try {
    return JSON.parse(schema);
  } catch {
    // eslint-disable-next-line no-console
    console.warn('Schema is not valid JSON');

    return null;
  }
}

export function getImageFieldKeys(schema) {
  return _.reduce(
    schema,
    (result, field, controlName) => {
      if (
        field.format === FIELD_FORMATS.IMAGE ||
        field.format === FIELD_FORMATS.IMAGE_ARRAY
      ) {
        result.push(controlName);
      }

      return result;
    },
    [],
  );
}
