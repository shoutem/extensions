import pack from './package.json';

// defines scope for the current extension state within the global app's state
export function ext(resourceName) {
  return resourceName ? `${pack.name}.${resourceName}` : pack.name;
}

export const LOW_QUANTITY_MAX_SIZE = 10;

export const VERIFICATION_STACK = ext('Verification');

export const THC_CBD_SHARE_UNITS = {
  MILLIGRAM_UNIT: 'mg',
  PERCENT: '%',
};

export const ALL_CATEGORY = {
  name: 'All',
  id: 'All',
  description: 'All',
};

export const ORDER_STATUSES = {
  NEW: 'NEW',
  DRIVER_LOADING: 'DRIVER_LOADING',
  DELIVERING: 'DELIVERING',
  ARRIVED: 'ARRIVED',
  DONE: 'DONE',
  CANCELED: 'CANCELED',
  DRAFT: 'DRAFT',
};
