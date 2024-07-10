import React, { useCallback, useEffect, useState } from 'react';
import { FlatList } from 'react-native';
import TrackPlayer, {
  useActiveTrack,
  usePlayWhenReady,
} from 'react-native-track-player';
import { useSelector } from 'react-redux';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { connectStyle } from '@shoutem/theme';
import { ext } from '../../const';
import { getActiveSource } from '../../redux';
import QueueListFooter from './QueueListFooter';
import QueueListHeader from './QueueListHeader';
import QueueListItem from './QueueListItem';

const QueueList = ({ onItemPress, style }) => {
  const activeTrack = useActiveTrack();
  const isPlaying = usePlayWhenReady();
  const playlist = useSelector(getActiveSource);

  const [queue, setQueue] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    TrackPlayer.getQueue().then(setQueue);
  }, []);

  const handleLoadMore = useCallback(async () => {
    if (
      loading ||
      queue.length === playlist.trackCount ||
      !_.isFunction(playlist.onLoadMoreQueue)
    ) {
      return;
    }

    setLoading(true);

    const tracks = await playlist.onLoadMoreQueue();
    await TrackPlayer.add(tracks);

    const newQueue = await TrackPlayer.getQueue();
    setQueue(newQueue);

    setLoading(false);
  }, [loading, playlist, queue.length]);

  const renderItem = useCallback(
    ({ item: track, index }) => (
      <QueueListItem
        index={index}
        track={track}
        isNowPlayingItem={false}
        activeTrack={activeTrack}
        isPlaying={isPlaying}
        onPress={onItemPress}
      />
    ),
    [activeTrack, onItemPress, isPlaying],
  );

  // If we render Flatlist, before data gets populated, it'll trigger onEndReached on mount and will not
  // trigger again later when it's populated, when bottom will be reached.
  // We also don't consider playlist a playlist unless there's at least 2 items.
  if (queue.length < 2) {
    return null;
  }

  return (
    <FlatList
      data={queue}
      loading={loading}
      initialNumToRender={20}
      renderItem={renderItem}
      ListHeaderComponent={QueueListHeader}
      ListFooterComponent={loading && <QueueListFooter />}
      showsVerticalScrollIndicator={false}
      onEndReached={handleLoadMore}
      onEndReachedThreshold={0.1}
      style={style.container}
    />
  );
};

QueueList.propTypes = {
  style: PropTypes.object.isRequired,
  onItemPress: PropTypes.func.isRequired,
};

export default connectStyle(ext('QueueList'))(QueueList);
