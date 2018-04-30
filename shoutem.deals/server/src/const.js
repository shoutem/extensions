import pack from '../package.json';

// defines scope for the current extension state within the global app's state
export function ext(resourceName) {
  return resourceName ? `${pack.name}.${resourceName}` : pack.name;
}

export const DISPLAY_DATE_FORMAT = 'DD MMM \'YY';
export const DISPLAY_TIME_FORMAT = 'hh:mm a';
