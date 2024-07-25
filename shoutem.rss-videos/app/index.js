import './navigation';
import VideosSmallList from './screens/SmallVideosList';
import VideoDetails from './screens/VideoDetails';
import VideosList from './screens/VideosList';
import { reducer } from './redux';

export { appWillMount } from './app';

export const screens = {
  VideosList,
  VideosSmallList,
  VideoDetails,
};

export { reducer };
