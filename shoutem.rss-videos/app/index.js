import VideosList from './screens/VideosList';
import VideosSmallList from './screens/SmallVideosList';
import VideoDetails from './screens/VideoDetails';
import { reducer } from './redux';

export { appDidMount } from './app';

export const screens = {
  VideosList,
  VideosSmallList,
  VideoDetails,
};

export { reducer };
