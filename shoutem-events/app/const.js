// This file is auto-generated.
import pack from './package.json';
import _ from 'lodash';

export function ext(resourceName) {
  return resourceName ? `${pack.name}.${resourceName}` : pack.name;
}

export const EVENTS_SCHEME = ext('events');
export const EVENTS_TAG = 'latestEvents';
