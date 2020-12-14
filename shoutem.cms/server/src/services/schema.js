import _ from 'lodash';
import i18next from 'i18next';
import { getExtensionInstallation } from 'environment';
import {
  getSchemaPropertyKeys,
  getSchemaProperty,
} from '@shoutem/cms-dashboard';

function translateExt18n(extCanonicalName, key) {
  if (!key) {
    return null;
  }

  const translationKey = `${extCanonicalName}:${key}`;
  const translation = i18next.t(translationKey);

  return translation;
}

export function translateSchema(schema) {
  if (!schema) {
    return null;
  }

  const extensionInstallation = getExtensionInstallation();
  const extensionName = _.get(extensionInstallation, 'canonicalName');

  const translatedSchema = _.cloneDeep(schema);

  if (_.has(translatedSchema, 'title')) {
    translatedSchema.title = translateExt18n(
      extensionName,
      translatedSchema.title,
    );
  }

  const schemaPropertyKeys = getSchemaPropertyKeys(translatedSchema);
  _.forEach(schemaPropertyKeys, schemaPropertyKey => {
    const schemaProperty = getSchemaProperty(
      translatedSchema,
      schemaPropertyKey,
    );

    if (_.has(schemaProperty, 'title')) {
      schemaProperty.title = translateExt18n(
        extensionName,
        schemaProperty.title,
      );
    }
  });

  return translatedSchema;
}
