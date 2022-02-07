import _ from 'lodash';
import { resolvePreviewComponent } from './componentResolver';
import { resolveReactComponent } from './resolveReactComponent';
import { FIELD_FORMATS, FIELD_TYPES } from './schemaDefinitions';

export function mapDataToPreview(data) {
  const { format, type, variant } = data;

  // TODO - https://fiveminutes.jira.com/browse/SEEXT-11204
  // Create a hierarchy for this, an object of shape:
  // {type: { format: { variant: {...} } }}
  // This way, we'll know what [format] [type] supports & what
  // [variant] [format] supports
  if (
    _.includes(_.values(FIELD_FORMATS), format) &&
    _.includes(_.values(FIELD_TYPES), type)
  ) {
    const { Component, props } = resolvePreviewComponent(type, format, variant);

    const {
      displayPriority,
      title: label,
      controlName,
      showLabel = true,
    } = data;

    const resolvedProps = {
      ...props,
      key: `${controlName}${displayPriority}`,
      label,
      showLabel,
      value: data.value,
    };

    return resolveReactComponent(Component, resolvedProps);
  }

  return null;
}

export const PreviewBuilder = {
  mapDataToPreview,
};
