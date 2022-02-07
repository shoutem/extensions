import _ from 'lodash';
import { resolveFormComponent } from './componentResolver';
import { resolveReactComponent } from './resolveReactComponent';
import { FIELD_FORMATS, FIELD_TYPES } from './schemaDefinitions';

export function mapFormFieldToView(profileForm, user) {
  return profileForm.map(field => {
    const {
      defaultValue,
      displayPriority,
      format,
      key,
      title: label,
      type,
      variant,
    } = field;

    if (
      _.includes(_.values(FIELD_FORMATS), format) &&
      _.includes(_.values(FIELD_TYPES), type)
    ) {
      const { Component, props } = resolveFormComponent(type, format, variant);

      // FormImagesPreview accepts array of strings - convert user.profile.image string to array
      const value =
        key === 'image' && format === FIELD_FORMATS.IMAGE
          ? _.compact([user.profile[key]]) || defaultValue
          : user.profile[key] || defaultValue;

      const resolvedProps = {
        ...props,
        key: `${label}${displayPriority}`,
        label,
        value,
      };

      return resolveReactComponent(Component, resolvedProps);
    }

    return null;
  });
}
