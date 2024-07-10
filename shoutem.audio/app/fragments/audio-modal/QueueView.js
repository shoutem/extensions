import React, { useCallback } from 'react';
import TrackPlayer from 'react-native-track-player';
import { NowPlayingHeader, QueueList } from '../../components';

/**
 * Manages the display and interaction of a queue of active playlist.
 * Renders active track and a queue list. Scrolling to bottom of the queue list should fetch
 * next set of tracks, if onLoadMoreQueue callback was provided inside activeSource redux state.
 */
const QueueView = () => {
  const handleListItemPress = useCallback(async index => {
    await TrackPlayer.skip(index);
    await TrackPlayer.play();
  }, []);

  return (
    <>
      <NowPlayingHeader onPress={handleListItemPress} />
      <QueueList onItemPress={handleListItemPress} />
    </>
  );
};

export default QueueView;
