// This file is auto-generated.
import pack from './package.json';

export function ext(resourceName) {
  return resourceName ? `${pack.name}.${resourceName}` : pack.name;
}

export const PLACES_SCHEMA = ext('places');
export const PLACE_DETAILS_SCREEN = ext('PlaceDetails');
export const DEALS_SCHEMA = 'shoutem.deals.deals';
export const DEALS_DETAILS_SCREEN = 'shoutem.deals.LargeDealDetailsScreen';
