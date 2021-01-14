import { isURL } from 'validator';
import _ from 'lodash';
import i18next from 'i18next';
import {
  getEditorSections,
  getSectionPropertyKey,
  getSchemaProperty,
} from './schema';
import {
  PROPERTY_TYPES,
  PROPERTY_FORMATS,
  PROPERTY_REFERENCED_SCHEMAS,
} from '../const';
import LOCALIZATION from './localization';

function validateRequiredField(fieldValue) {
  if (!fieldValue) {
    return i18next.t(LOCALIZATION.VALUE_REQUIRED_MESSAGE);
  }

  return null;
}

function validateNumericField(fieldValue) {
  const numberValue = _.toNumber(fieldValue);

  if (_.isNaN(numberValue)) {
    return i18next.t(LOCALIZATION.INVALID_NUMBER_MESSAGE);
  }

  return null;
}

function validateMinimumNumberField(fieldValue, minimum) {
  const numberValue = _.toNumber(fieldValue);

  if (numberValue < minimum) {
    return true;
  }

  return null;
}

function validateMaximumNumberField(fieldValue, maximum) {
  const numberValue = _.toNumber(fieldValue);

  if (numberValue > maximum) {
    return true;
  }

  return null;
}

function validateMinLengthField(fieldValue, minLength) {
  const stringValue = _.toString(fieldValue);

  if (!stringValue || stringValue.length < minLength) {
    return i18next.t(LOCALIZATION.INVALID_MIN_LENGTH_MESSAGE, { minLength });
  }

  return null;
}

function validateUrl(fieldValue) {
  if (fieldValue && !isURL(fieldValue)) {
    return i18next.t(LOCALIZATION.INVALID_URL_MESSAGE);
  }

  return null;
}

function validatePattern(fieldValue, pattern) {
  if (!fieldValue) {
    return null;
  }

  var regex = new RegExp(pattern);
  const match = regex.test(fieldValue);

  if (!match) {
    return true;
  }

  return null;
}

function validateProperty(schemaProperty, field) {
  const minLength = _.get(schemaProperty, 'minLength');
  const pattern = _.get(schemaProperty, 'pattern');
  const required = _.get(schemaProperty, 'required');
  const format = _.get(schemaProperty, 'format');

  if (required) {
    if (schemaProperty.type == PROPERTY_TYPES.OBJECT) {
      // check if video and photo object has url
      if (
        schemaProperty.referencedSchema ===
          PROPERTY_REFERENCED_SCHEMAS.VIDEO_ATTACHMENT ||
        schemaProperty.referencedSchema ===
          PROPERTY_REFERENCED_SCHEMAS.IMAGE_ATTACHMENT
      ) {
        const url = _.get(field, 'url');
        const error = validateRequiredField(url);

        if (error) {
          return error;
        }
      }

      if (schemaProperty.format === PROPERTY_FORMATS.ENTITY_REFERENCE) {
        const id = _.get(field, 'id');
        const error = validateRequiredField(id);

        if (error) {
          return error;
        }
      }
    }

    const error = validateRequiredField(field);
    if (error) {
      return error;
    }
  }

  if (minLength) {
    const error = validateMinLengthField(field, minLength);
    if (error) {
      return error;
    }
  }

  if (pattern) {
    const error = validatePattern(field, pattern);
    if (error) {
      return error;
    }
  }

  if (format === PROPERTY_FORMATS.URI && !pattern) {
    const error = validateUrl(field);
    if (error) {
      return error;
    }
  }

  if (
    format === PROPERTY_FORMATS.INTEGER ||
    format === PROPERTY_FORMATS.NUMBER
  ) {
    const error = validateNumericField(field);
    if (error) {
      return error;
    }

    if (_.has(schemaProperty, 'minimum')) {
      const error = validateMinimumNumberField(field, schemaProperty.minimum);
      if (error) {
        return error;
      }
    }

    if (_.has(schemaProperty, 'maximum')) {
      const error = validateMaximumNumberField(field, schemaProperty.maximum);
      if (error) {
        return error;
      }
    }
  }

  return null;
}

export function validateResourceForm(schema, form) {
  const sections = getEditorSections(schema);
  const errors = {};

  _.forEach(sections, section => {
    _.forEach(section.properties, sectionProperty => {
      const propertyKey = getSectionPropertyKey(sectionProperty);
      const schemaProperty = getSchemaProperty(schema, propertyKey);

      if (schemaProperty) {
        const field = _.get(form, propertyKey);
        const error = validateProperty(schemaProperty, field);

        if (error) {
          _.set(errors, propertyKey, error);
        }
      }
    });
  });

  return errors;
}
