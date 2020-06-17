function validateRequiredField(fieldValue) {
  if (!fieldValue) {
    return 'Value is required';
  }

  return null;
}

export function validateGroup(group) {
  const { name, imageUrl } = group;

  return {
    name: validateRequiredField(name),
    imageUrl: validateRequiredField(imageUrl),
  };
}
