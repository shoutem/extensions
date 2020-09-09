import { reducer } from './redux';
import PhotosGrid from './screens/PhotosGrid';
import PhotosList from './screens/PhotosList';
import PhotoDetails from './screens/PhotoDetails';

export const screens = {
  PhotosGrid,
  PhotosList,
  PhotoDetails,
};

export { reducer };

export { appDidMount } from './app';
