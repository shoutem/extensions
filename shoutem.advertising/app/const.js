import pack from './package.json';
// defines scope for the current extension state within the global app's state
export function ext(resourceName) {
  return resourceName ? `${pack.name}.${resourceName}` : pack.name;
}

export const BANNER_REQUEST_OPTIONS = {
  requestNonPersonalizedAdsOnly: true,
};
