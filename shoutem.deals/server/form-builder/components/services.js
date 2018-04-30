export function fieldInError(formField) {
  return formField.touched && formField.error;
}
