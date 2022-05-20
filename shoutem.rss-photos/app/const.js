// This file is auto-generated.
import pack from './package.json';

export function ext(resourceName) {
  return resourceName ? `${pack.name}.${resourceName}` : pack.name;
}

export const DEFAULT_PAGE_LIMIT = 20;
export const PHOTO_DETAILS_SCREEN = ext('PhotoDetails');
export const PHOTOS_LIST_SCREEN = ext('PhotosList');
export const PHOTOS_SCHEMA_ITEM = 'Photo';
export const RSS_PHOTOS_SCHEMA = 'shoutem.proxy.photos';
export const PHOTOS_COLLECTION_TAG = 'allPhotos';
