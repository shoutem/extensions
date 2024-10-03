import _ from 'lodash';
import { combineReducers } from 'redux';
import { REHYDRATE } from 'redux-persist/constants';
import { mapReducers } from '@shoutem/redux-composers';
import { collection, one, storage } from '@shoutem/redux-io';
import { getAllShortcuts } from 'shoutem.application';
import { rssFeed } from 'shoutem.rss';
import {
  DOWNLOADED_EPISODE_ADDED,
  DOWNLOADED_EPISODE_REMOVED,
  DOWNLOADED_EPISODE_UPDATED,
  EPISODE_TAG,
  ext,
  FAVORITED_EPISODES_TAG,
  RSS_PODCAST_SCHEMA,
  SET_DOWNLOAD_IN_PROGRESS,
  UPDATE_LAST_PLAYED,
} from '../const';
import { getFileNameFromPath } from '../services';
import { REMOVE_FAVORITE_EPISODE, SAVE_FAVORITE_EPISODE } from './actions';

const downloadedEpisodes = (state = [], action) => {
  if (action.type === REHYDRATE) {
    return [..._.get(action, ['payload', ext(), 'downloadedEpisodes'], [])];
  }

  // This is handled through redux because the user can start a download and
  // then navigate to other screens.
  if (action.type === SET_DOWNLOAD_IN_PROGRESS) {
    return [...state, { id: action.payload.id, downloadInProgress: true }];
  }

  // The episode already exists in the reducer state, so we update it with a
  // fileName and set downloadInProgress to false.
  if (action.type === DOWNLOADED_EPISODE_ADDED) {
    return state.map(episode => {
      if (episode.id === action.payload.id) {
        return {
          id: episode.id,
          downloadInProgress: false,
          fileName: action.payload.fileName,
        };
      }

      return episode;
    });
  }

  if (action.type === DOWNLOADED_EPISODE_REMOVED) {
    return state.filter(episode => episode.id !== action.payload.id);
  }

  if (action.type === DOWNLOADED_EPISODE_UPDATED) {
    return state.map(episode => {
      if (episode.id === action.payload.downloadedEpisode.id) {
        return {
          id: episode.id,
          downloadInProgress: false,
          fileName: getFileNameFromPath(action.payload.downloadedEpisode.path),
        };
      }

      return episode;
    });
  }

  return state;
};

// Handle backwards compatibility - before reducer was an array of episodes,
// and now it'll be object with shortcutId as key & episode.uuid array as value.
const remapReducerForBackwardsCompatibiltiy = (state, favoritedEpisodes) => {
  try {
    // We get all shortcuts, to be able to associate favorited episode to its shortcut.
    // We do it by comparing episode feedUrl and shortcut settings feedUrl.
    // Then, we remap reducer - we're now using object with shortcutId as key & episode uuid array as value.
    const shortcuts = getAllShortcuts(state);

    return _.reduce(
      favoritedEpisodes,
      (result = {}, episode) => {
        const shortcutId = _.find(
          shortcuts,
          shortcut => shortcut.settings?.feedUrl === episode.feedUrl,
        )?.id;

        if (!shortcutId || !episode) {
          return result;
        }

        return {
          ...result,
          [shortcutId]: [...(result[shortcutId] ?? []), episode.uuid],
        };
      },
      {},
    );
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log('Failed to remap reducer, ', e);

    // Return old reducer in case anything has failed while remapping reducer.
    return [..._.get(state, [ext(), 'favoritedEpisodes'], [])];
  }
};

// State shape example:
// {
//   'shortcutId3094530iojfdojfi3u03': [uuid1, uuid2, uuid3],
//   'shortcutId398z78ifduh93': [uuid1, uuid2, uuid3]
// }
const favoritedEpisodes = (state = [], action) => {
  if (action.type === REHYDRATE) {
    const favoritedEpisodes = _.get(
      action,
      ['payload', ext(), 'favoritedEpisodes'],
      {},
    );

    // Handle backwards compatibility for when we were saving array of episode objects
    // into favoriteEpisodes reducer. We're remapping these objects to be saved in new state shape.
    if (_.isArray(favoritedEpisodes)) {
      return remapReducerForBackwardsCompatibiltiy(
        action.payload,
        favoritedEpisodes,
      );
    }

    // Current favorites state is implemented, all good.
    return favoritedEpisodes;
  }

  if (action.type === SAVE_FAVORITE_EPISODE) {
    const {
      payload: { uuid, shortcutId },
    } = action;

    const alreadyFavorited = _.some(
      state[shortcutId],
      favoritedUuid => favoritedUuid === uuid,
    );

    if (alreadyFavorited) {
      return state;
    }

    return {
      ...state,
      [shortcutId]: [...(state[shortcutId] ?? []), uuid],
    };
  }

  if (action.type === REMOVE_FAVORITE_EPISODE) {
    const {
      payload: { uuid },
    } = action;

    // Go through all shortcut favorite reducers and remove given uuid when found.
    const newState = _.reduce(
      state,
      (result, shortcutFavorites, shortcutId) => {
        return {
          ...result,
          [shortcutId]: _.filter(
            shortcutFavorites,
            favoriteUuid => favoriteUuid !== uuid,
          ),
        };
      },
      {},
    );

    return newState;
  }

  return state;
};

const lastPlayed = (state = {}, action) => {
  if (action.type === REHYDRATE) {
    return _.get(action, ['payload', ext(), 'lastPlayed'], {});
  }

  if (action.type === UPDATE_LAST_PLAYED) {
    const { payload } = action;

    return {
      ...state.lastPlayed,
      [payload.feedUrl]: payload.track,
    };
  }

  return state;
};

function getShortcutId(action) {
  return _.get(action, ['meta', 'options', 'shortcutId']);
}

export default combineReducers({
  downloadedEpisodes,
  episodes: storage(RSS_PODCAST_SCHEMA),
  latestEpisodes: rssFeed(RSS_PODCAST_SCHEMA, 'latestEpisodes'),
  favoritedEpisodes,
  favoritedEpisodesCollection: mapReducers(getShortcutId, () =>
    collection(RSS_PODCAST_SCHEMA, FAVORITED_EPISODES_TAG),
  ),
  episode: one(RSS_PODCAST_SCHEMA, EPISODE_TAG),
  lastPlayed,
});
