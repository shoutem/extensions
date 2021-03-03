import PhotosScreen from './screens/PhotosScreen';
import * as extension from './extension.js';
import reducer from './reducers/';

export const screens = {
  ...extension.screens,
  PhotosMediumList: PhotosScreen,
  PhotosTileList: PhotosScreen,
  PhotosCompactList: PhotosScreen,
  PhotosLargeList: PhotosScreen,
};

export { reducer };
