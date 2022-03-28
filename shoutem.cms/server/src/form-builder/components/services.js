export function fieldInError(formField) {
  return formField && formField.touched && formField.error;
}
