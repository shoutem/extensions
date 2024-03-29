import _ from 'lodash';
import { combineReducers } from 'redux';
import { REHYDRATE } from 'redux-persist/constants';
import { storage } from '@shoutem/redux-io';
import { rssFeed } from 'shoutem.rss';
import {
  DOWNLOADED_EPISODE_ADDED,
  DOWNLOADED_EPISODE_REMOVED,
  DOWNLOADED_EPISODE_UPDATED,
  ext,
  RSS_PODCAST_SCHEMA,
  SET_DOWNLOAD_IN_PROGRESS,
  UPDATE_LAST_PLAYED,
} from '../const';
import { getFileNameFromPath } from '../services';
import { FAVORITE_EPISODE, UNFAVORITE_EPISODE } from './actions';

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

const favoritedEpisodes = (state = [], action) => {
  if (action.type === REHYDRATE) {
    return [..._.get(action, ['payload', ext(), 'favoritedEpisodes'], [])];
  }

  if (action.type === FAVORITE_EPISODE) {
    const {
      payload: { episode },
    } = action;

    const alreadyFavorited = !!state.find(
      favoritedEpisode => favoritedEpisode.id === episode.id,
    );

    if (alreadyFavorited) {
      return state;
    }

    return [...state, episode];
  }

  if (action.type === UNFAVORITE_EPISODE) {
    const newState = state.filter(episode => episode.id !== action.payload.id);

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

export default combineReducers({
  downloadedEpisodes,
  episodes: storage(RSS_PODCAST_SCHEMA),
  favoritedEpisodes,
  latestEpisodes: rssFeed(RSS_PODCAST_SCHEMA, 'latestEpisodes'),
  lastPlayed,
});
