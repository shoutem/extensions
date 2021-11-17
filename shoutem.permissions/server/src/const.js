import pack from '../package.json';

// defines scope for the current extension state within the global app's state
export function ext(resourceName) {
  return resourceName ? `${pack.name}.${resourceName}` : pack.name;
}

export const PERMISSIONS_DUMMY_JSON_URL = 'https://s3.amazonaws.com/static.shoutem.com/extensions/permissions.json';
