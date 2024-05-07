import i18next from 'i18next';
import _ from 'lodash';
import {
  PROPERTY_FORMATS,
  PROPERTY_REFERENCED_SCHEMAS,
  PROPERTY_TYPES,
} from '../const';
import LOCALIZATION from './localization';
import { getSchemaProperty, getSchemaPropertyKeys } from './schema';

export function getMappedCmsToCsvProperties(schema) {
  const schemaPropertyKeys = getSchemaPropertyKeys(schema);
  const mappedOptions = [];

  // add categories import
  mappedOptions.push({
    value: 'categories',
    label: i18next.t(LOCALIZATION.CATEGORY_SELECTOR_TITLE),
  });

  _.forEach(schemaPropertyKeys, schemaPropertyKey => {
    const schemaProperty = getSchemaProperty(schema, schemaPropertyKey);

    if (
      schemaProperty.type === PROPERTY_TYPES.OBJECT &&
      schemaProperty.referencedSchema ===
        PROPERTY_REFERENCED_SCHEMAS.IMAGE_ATTACHMENT
    ) {
      const value = `${schemaPropertyKey}.url`;
      mappedOptions.push({ value, label: schemaProperty.title });

      return true;
    }

    if (
      schemaProperty.type === PROPERTY_TYPES.OBJECT &&
      schemaProperty.referencedSchema ===
        PROPERTY_REFERENCED_SCHEMAS.VIDEO_ATTACHMENT
    ) {
      const value = `${schemaPropertyKey}.url`;
      mappedOptions.push({ value, label: schemaProperty.title });

      return true;
    }

    if (
      schemaProperty.type === PROPERTY_TYPES.OBJECT &&
      schemaProperty.format === PROPERTY_FORMATS.DATE_TIME
    ) {
      mappedOptions.push({
        value: `${schemaPropertyKey}.date`,
        label: `${schemaProperty.title} - ${i18next.t(
          LOCALIZATION.DATE_TIME_DATE_LABEL,
        )}`,
      });

      mappedOptions.push({
        value: `${schemaPropertyKey}.time`,
        label: `${schemaProperty.title} - ${i18next.t(
          LOCALIZATION.DATE_TIME_TIME_LABEL,
        )}`,
      });

      mappedOptions.push({
        value: `${schemaPropertyKey}.timezoneid`,
        label: `${schemaProperty.title} - ${i18next.t(
          LOCALIZATION.DATE_TIME_TIMEZONE_LABEL,
        )}`,
      });

      return true;
    }

    if (
      schemaProperty.type === PROPERTY_TYPES.OBJECT &&
      schemaProperty.format === PROPERTY_FORMATS.GEOLOCATION
    ) {
      const formattedAddress = `${schemaPropertyKey}.formattedAddress`;
      mappedOptions.push({
        value: formattedAddress,
        label: schemaProperty.title,
      });

      const latitude = `${schemaPropertyKey}.latitude`;
      mappedOptions.push({
        value: latitude,
        label: `${schemaProperty.title} - ${i18next.t(
          LOCALIZATION.GEOLOCATION_LATITUDE_LABEL,
        )}`,
      });

      const longitude = `${schemaPropertyKey}.longitude`;
      mappedOptions.push({
        value: longitude,
        label: `${schemaProperty.title} - ${i18next.t(
          LOCALIZATION.GEOLOCATION_LONGITUDE_LABEL,
        )}`,
      });

      return true;
    }

    mappedOptions.push({
      value: schemaPropertyKey,
      label: schemaProperty.title,
    });

    return true;
  });

  return mappedOptions;
}
