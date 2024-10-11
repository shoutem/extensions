import { useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import _ from 'lodash';
import URI from 'urijs';
import { getMeta, hasNext, isBusy } from '@shoutem/redux-io';
import { getStatus, setStatus } from '@shoutem/redux-io/status';
import { updateActiveSource } from 'shoutem.audio';
import {
  DEFAULT_PAGE_LIMIT,
  EPISODE_CHECK_TAG,
  EPISODES_COLLECTION_TAG,
  PODCAST_TRACK_IDENTIFIER,
} from '../const';
import { loadEpisodes, loadMoreTracks } from '../redux';

/**
 *
 * Hook for resolving intial queue & loading more tracks into queue.
 * It'll check if last played episode still exists in feed, fetch its position in feed,
 * then load all tracks before it **and** 20 tracks after it.
 * @returns boolean indicator if initial queue is loaded & onLoadMoreQueue callback
 */

// TODO - initial track prop koji je lastplayed ili initial track s details.
export const useLoadQueue = ({
  queueLoaded,
  shortcutId,
  feedUrl,
  data,
  activeSource,
  initialTrackId,
}) => {
  const dispatch = useDispatch();

  const [initialQueueLoaded, setInitialQueueLoaded] = useState(queueLoaded);
  const [statusUpdated, setStatusUpdated] = useState(false);

  const loadInitialQueue = async () => {
    // Skip if feed is still loading,
    // or if more queue is loading,
    // or if queue is already loaded.
    // Last is possible when starting player from details screen, or if
    // we want to exit here early - when feed tracks are loaded and user has not played any episode before.
    if (initialQueueLoaded || isBusy(data)) {
      return;
    }

    // The rest of the hook code takes care of case when user is resuming playlist.
    // Initial track is actually last played track in feed playlist.
    // We have to check if last played episode exists in feed and if it does,
    // we have to preload all episodes before it.

    // Set queue loaded & ready if feed has only 20 items.
    if (!hasNext(data)) {
      setInitialQueueLoaded(true);
      return;
    }

    // Search feed for last played episode id. We're checking if episode exists in feed, get episode position
    // and then preload the rest of initial queue - all episodes before last played episode.
    const episodeResults = await dispatch(
      loadEpisodes(
        shortcutId,
        {
          // Transform track id to episode id, to be able to perform search request.
          id: initialTrackId.replace(`${PODCAST_TRACK_IDENTIFIER}-`, ''),
          pageLimit: 1,
        },
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

  useEffect(() => {
    loadInitialQueue();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    updateFeedLinks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusUpdated, initialQueueLoaded, data?.length]);

  // When more queue data is loaded, onLoadMoreQueue has to be updated.
  useEffect(() => {
    if (!initialQueueLoaded || activeSource?.url !== feedUrl) {
      return;
    }

    dispatch(
      updateActiveSource({
        ...activeSource,
        onLoadMoreQueue: handleLoadMoreQueue,
        showArtwork: true,
      }),
    );

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data?.length, initialQueueLoaded, activeSource?.url]);

  return { initialQueueLoaded, handleLoadMoreQueue };
};
