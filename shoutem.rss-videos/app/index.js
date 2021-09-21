import VideosSmallList from './screens/SmallVideosList';
import VideoDetails from './screens/VideoDetails';
import VideosList from './screens/VideosList';
import { reducer } from './redux';

export { appDidMount } from './app';

import './navigation';

export const screens = {
  VideosList,
  VideosSmallList,
  VideoDetails,
};

export { reducer };
