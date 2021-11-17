import { PROPERTY_TYPES, FILTER_OPERATOR_TYPES } from '../const';
import { getSchemaPropertyKeys, getSchemaProperty } from './schema';

export function getFilterableSchemaKeys(schema) {
  const schemaPropertyKeys = getSchemaPropertyKeys(schema);

  return _.reduce(
    schemaPropertyKeys,
    (result, schemaPropertyKey) => {
      const schemaProperty = getSchemaProperty(schema, schemaPropertyKey);

      if (
        schemaProperty.type === PROPERTY_TYPES.STRING ||
        schemaProperty.type === PROPERTY_TYPES.INTEGER ||
        schemaProperty.type === PROPERTY_TYPES.NUMBER
      ) {
        result.push(schemaPropertyKey);
      }

      return result;
    },
    [],
  );
}

export function getSchemaPropertyOperators(schema, schemaPropertyKey) {
  const schemaProperty = getSchemaProperty(schema, schemaPropertyKey);
  if (!schemaProperty) {
    return [];
  }

  if (
    schemaProperty.type === PROPERTY_TYPES.INTEGER ||
    schemaProperty.type === PROPERTY_TYPES.NUMBER
  ) {
    return [
      FILTER_OPERATOR_TYPES.LESS_THAN,
      FILTER_OPERATOR_TYPES.EQUALS,
      FILTER_OPERATOR_TYPES.GREATER_THAN,
    ];
  }

  if (schemaProperty.type === PROPERTY_TYPES.STRING) {
    return [FILTER_OPERATOR_TYPES.EQUALS, FILTER_OPERATOR_TYPES.CONTAINS];
  }

  return [];
}
