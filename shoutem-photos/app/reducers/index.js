import { storage, collection } from '@shoutem/redux-io';
import { combineReducers } from 'redux';
import { ext } from '../const';

export const SHOUTEM_CATEGORIES_SCHEME = 'shoutem.core.categories';
export const SHOUTEM_PROXY_PHOTOS_SCHEME = 'shoutem.proxy.photos';

export default combineReducers({
  photos: storage(ext('Photos')),
  allPhotos: collection(ext('Photos'), 'all'),
  rssPhotos: storage(SHOUTEM_PROXY_PHOTOS_SCHEME),
  allRssPhotos: collection(SHOUTEM_PROXY_PHOTOS_SCHEME, 'allRssPhotos'),
  photosCategories: collection(SHOUTEM_CATEGORIES_SCHEME, 'photosCategories'),
})