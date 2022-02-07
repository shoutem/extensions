import _ from 'lodash';
import {
  resolveFormComponent,
  SUBMIT_BUTTON_COMPONENT,
} from './componentResolver';
import { resolveReactComponent } from './resolveReactComponent';
import { FIELD_FORMATS, FIELD_TYPES } from './schemaDefinitions';

export function mapFormFieldToView(
  formField,
  handleValueChange,
  getValue,
  getError,
) {
  const { format, type, variant } = formField;

  // TODO - https://fiveminutes.jira.com/browse/SEEXT-11204
  // Create a hierarchy for this, an object of shape:
  // {type: { format: { variant: {...} } }}
  // This way, we'll know what [format] [type] supports & what
  // [variant] [format] supports
  if (
    _.includes(_.values(FIELD_FORMATS), format) &&
    _.includes(_.values(FIELD_TYPES), type)
  ) {
    const { Component, props } = resolveFormComponent(type, format, variant);

    const {
      fieldName,
      displayPriority,
      title,
      formLabel,
      placeholder,
      required = false,
    } = formField;

    const resolvedProps = {
      ...props,
      key: `${fieldName}${displayPriority}`,
      label: formLabel || title,
      onInputChange: value => handleValueChange(fieldName, value),
      value: getValue(fieldName, props.defaultValue),
      error: getError(fieldName),
      placeholder,
      required,
    };

    return resolveReactComponent(Component, resolvedProps);
  }

  return null;
}

export function mapSubmitButtonToView(onPress, CustomSubmitButton = null) {
  const SubmitButtonComponent = CustomSubmitButton || SUBMIT_BUTTON_COMPONENT;

  return resolveReactComponent(SubmitButtonComponent, { onPress });
}

export const FormBuilder = {
  mapFormFieldToView,
  mapSubmitButtonToView,
};
