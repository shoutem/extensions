import _ from 'lodash';
import {
  FIELD_FORMATS,
  FIELD_TYPES,
} from '../form-builder/services/schemaDefinitions';

export function remapImageStringToArray(profile, schema) {
  return _.reduce(
    profile,
    (result, value, key) => {
      if (
        schema[key]?.type === FIELD_TYPES.IMAGE &&
        schema[key]?.format === FIELD_FORMATS.IMAGE
      ) {
        return {
          ...result,
          [key]: _.compact([value]),
        };
      }

      return { ...result, [key]: value };
    },
    {},
  );
}

export function remapImagesArrayToString(images, schema) {
  return _.reduce(
    images,
    (result, value, key) => {
      if (
        schema[key]?.type === FIELD_TYPES.IMAGE &&
        schema[key]?.format === FIELD_FORMATS.IMAGE
      ) {
        return {
          ...result,
          [key]: value[0] || null,
        };
      }

      return {
        ...result,
        [key]: value,
      };
    },
    {},
  );
}
