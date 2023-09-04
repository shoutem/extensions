// This file is managed by Shoutem CLI
// It exports screens and themes from extension.json
// You should not change it manually

// screens imports
import MyVideosCompactList from './screens/MyVideosCompactList';
import MyVideosList from './screens/MyVideosList';
import VideoDetails from './screens/VideoDetails';
import VideosCompactList from './screens/VideosCompactList';
import VideosList from './screens/VideosList';

export const screens = {
  VideosCompactList,
  VideosList,
  VideoDetails,
  VideoDetailsWithoutShare: VideoDetails,
  MyVideosList,
  MyVideosCompactList,
};
