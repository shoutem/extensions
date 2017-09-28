// This file is managed by Shoutem CLI
// You should not change it
import pack from './package.json';

// screens imports
import CompactGridPhotosScreen from './screens/CompactGridPhotosScreen';
import FixedGridPhotosScreen from './screens/FixedGridPhotosScreen';
import PhotoDetailsScreen from './screens/PhotoDetailsScreen';
import PhotosScreen from './screens/PhotosScreen';

export const screens = {
  PhotosScreen,
  CompactGridPhotosScreen,
  FixedGridPhotosScreen,
  PhotoDetailsScreen,
};

export const themes = {

};

export function ext(resourceName) {
  return resourceName ? `${pack.name}.${resourceName}` : pack.name;
}
