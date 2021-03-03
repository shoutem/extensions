import PhotoDetails from './screens/PhotoDetails';
import PhotosGrid from './screens/PhotosGrid';
import PhotosList from './screens/PhotosList';
import { reducer } from './redux';

export const screens = {
  PhotosGrid,
  PhotosList,
  PhotoDetails,
};

export { reducer };

export { appDidMount } from './app';
