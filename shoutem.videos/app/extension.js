// This file is managed by Shoutem CLI
// It exports screens and themes from extension.json
// You should not change it manually

// screens imports
import MyVideosCompactList from './screens/MyVideosCompactList';
import MyVideosList from './screens/MyVideosList';
import VideoDetails from './screens/VideoDetails';
import VideosCompactList from './screens/VideosCompactList';
import VideosList from './screens/VideosList';
// TODO: Remove VideosLargeList for next major release, currently deprecated
import VideosLargeList from './screens/VideosLargeList';
// TODO: Remove VideosSmallList for next major release, currently deprecated
import VideosSmallList from './screens/VideosSmallList';

export const screens = {
  VideosCompactList,
  VideosSmallList,
  VideosList,
  VideosLargeList,
  VideoDetails,
  VideoDetailsWithoutShare: VideoDetails,
  MyVideosList,
  MyVideosCompactList,
};
