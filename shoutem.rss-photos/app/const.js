// This file is auto-generated.
import pack from './package.json';

export function ext(resourceName) {
  return resourceName ? `${pack.name}.${resourceName}` : pack.name;
}

export const PHOTOS_SCHEMA_ITEM = 'Photo';
export const PHOTO_DETAILS_SCREEN = ext('PhotoDetails');
export const RSS_PHOTOS_SCHEMA = 'shoutem.proxy.photos';
