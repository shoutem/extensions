import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import _ from 'lodash';
import URI from 'urijs';
import { getMeta, hasNext, isBusy } from '@shoutem/redux-io';
import { getStatus, setStatus } from '@shoutem/redux-io/status';
import { getActiveSource, updateActiveSource } from 'shoutem.audio';
import {
  DEFAULT_PAGE_LIMIT,
  EPISODE_CHECK_TAG,
  EPISODES_COLLECTION_TAG,
  PODCAST_TRACK_IDENTIFIER,
} from '../const';
import { getLastPlayed, loadEpisodes, loadMoreTracks } from '../redux';

/**
 *
 * Hook for resolving intial queue & loading more tracks into queue.
 * It'll check if last played episode still exists in feed, fetch its position in feed,
 * then load all tracks before it **and** 20 tracks after it.
 * @returns boolean indicator if initial queue is loaded & onLoadMoreQueue callback
 */
export const useLoadQueue = (feedUrl, data, shortcutId) => {
  const dispatch = useDispatch();

  const [initialQueueLoaded, setInitialQueueLoaded] = useState(false);
  const [statusUpdated, setStatusUpdated] = useState(false);

  const activeSource = useSelector(getActiveSource);
  const lastPlayedEpisodeTrack = useSelector(state =>
    getLastPlayed(state, feedUrl),
  );

  const lastPlayedEpisodeId = lastPlayedEpisodeTrack?.id.replace(
    `${PODCAST_TRACK_IDENTIFIER}-`,
    '',
  );

  useEffect(() => {
    loadInitialQueue();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    updateFeedLinks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusUpdated, initialQueueLoaded, data?.length]);

  const loadInitialQueue = async () => {
    // Skip if feed is still loading, or if more queue is loading or if already loaded.
    if (initialQueueLoaded || isBusy(data)) {
      return;
    }

    // Set queue loaded if user has not played any track before or if feed has only 20 items.
    if (!lastPlayedEpisodeTrack || !hasNext(data)) {
      setInitialQueueLoaded(true);
      return;
    }

    // Search feed for last played episode id. We're checking if episode exists in feed, get episode position
    // and then preload the rest of initial queue - all episodes before last played episode.
    const episodeResults = await dispatch(
      loadEpisodes(
        shortcutId,
        { id: lastPlayedEpisodeId, pageLimit: 1 },
        EPISODE_CHECK_TAG,
      ),
    );

    const episodeResult = _.head(episodeResults);

    // If episode was removed from feed, initial 20 episodes are alredy loaded. User will manually load more.
    if (!episodeResult) {
      setInitialQueueLoaded(true);
      return;
    }

    await dispatch(
      loadEpisodes(
        shortcutId,
        {
          pageLimit: Math.floor(episodeResult.position + DEFAULT_PAGE_LIMIT),
        },
        EPISODES_COLLECTION_TAG,
      ),
    );

    setInitialQueueLoaded(true);
  };

  // After initial queue episodes are loaded, links get broken - page[offset] is 0 and page[limit] is
  // lastPlayedPosition + 20. This updates links to expected values, no prev link and next - number of
  // episodes loaded previously & default limit
  const updateFeedLinks = () => {
    if (initialQueueLoaded && !statusUpdated) {
      const currentStatus = getStatus(data);

      if (!currentStatus.links.next) {
        return;
      }

      const currentNextLink = currentStatus.links.next
        ? new URI(currentStatus.links.next)
        : null;

      currentNextLink.setQuery('page[limit]', DEFAULT_PAGE_LIMIT);
      currentNextLink.setQuery('page[offset]', data.length);

      const newNextLink = currentNextLink ? currentNextLink.toString() : null;

      const updatedStatus = {
        ...currentStatus,
        links: {
          ...currentStatus.links,
          prev: null,
          next: newNextLink,
        },
      };

      setStatus(data, updatedStatus);
      // State flag for preventing this from running again, when data is updated.
      setStatusUpdated(true);
    }
  };

  // When more episodes are loaded into collection, add respective tracks to the end of queue.
  const handleLoadMoreQueue = useCallback(
    async () => {
      const defaultArtwork = getMeta(data)?.imageUrl;

      return dispatch(loadMoreTracks(data, feedUrl, defaultArtwork));
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [data?.length],
  );

  // When more queue data is loaded, onLoadMoreQueue has to be updated.
  useEffect(() => {
    if (!initialQueueLoaded || activeSource?.url !== feedUrl) {
      return;
    }

    dispatch(
      updateActiveSource({
        ...activeSource,
        onLoadMoreQueue: handleLoadMoreQueue,
      }),
    );

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data?.length, initialQueueLoaded, activeSource?.url]);

  return { initialQueueLoaded, handleLoadMoreQueue };
};
