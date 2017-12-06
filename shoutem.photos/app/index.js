import reducer from './reducers/';
import * as extension from './extension.js';
import PhotosScreen from './screens/PhotosScreen';

export const screens = {
  ...extension.screens,
  PhotosMediumList: PhotosScreen,
  PhotosTileList: PhotosScreen,
  PhotosCompactList: PhotosScreen,
  PhotosLargeList: PhotosScreen,
};

export { reducer, };
