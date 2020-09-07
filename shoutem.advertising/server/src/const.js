import pack from '../package.json';

// defines scope for the current extension state within the global app's state
export function ext(resourceName) {
  return resourceName ? `${pack.name}.${resourceName}` : pack.name;
}

export const BANNER_PLACEMENT_OPTIONS = [
  {
    value: 'Top',
    label: 'Top',
  },
  {
    value: 'Bottom',
    label: 'Bottom',
  },
];

export const AD_CONTENT_RATINGS = [
  {
    value: 'G',
    label: 'G - General audiences',
  },
  {
    value: 'MA',
    label: 'MA - Mature audiences.',
  },
  {
    value: 'PG',
    label: 'PG - Parental guidance.',
  },
  {
    value: 'T',
    label: 'T - Teen',
  },
];
