import _ from 'lodash';
import { combineReducers } from 'redux';
import { preventStateRehydration } from 'shoutem.redux';
import { REHYDRATE } from 'redux-persist/constants';

import { mapReducers } from '@shoutem/redux-composers';
import { storage, collection } from '@shoutem/redux-io';

import {
  UPDATE_LOCATION_PERMISSION,
  UPDATE_SECOND_PROMPT,
  CLEAR_SCREEN_STATE,
  SET_SCREEN_STATE,
} from './actions';

export const CATEGORIES_SCHEMA = 'shoutem.core.categories';
export const IMAGE_ATTACHMENTS_SCHEMA = 'shoutem.core.image-attachments';
export const VIDEO_ATTACHMENTS_SCHEMA = 'shoutem.core.video-attachments';
export const AUDIO_ATTACHMENTS_SCHEMA = 'shoutem.core.audio-attachments';

export const PermissionStatus = { APPROVED: 'approved', DENIED: 'denied' };

// 2 hours
const EXPIRATION_TIME_CATEGORIES = 2 * 60 * 60;

// 15 minutes
const EXPIRATION_TIME_RESOURCES = 15 * 60;

function getCategoryIds(action) {
  return _.get(action, ['meta', 'params', 'query', 'filter[categories]']);
}

function getParentCategoryId(action) {
  return _.get(action, ['meta', 'params', 'query', 'filter[parent]']);
}

/**
 * Map reducer use this creator to create new collection reducer for every key.
 * This is important to get different collection ids for every collection.
 * @param schema
 * @param settings
 * @returns {function} - reducer creator
 */
function createCollectionCreator(schema, settings) {
  return () => collection(schema, undefined, settings);
}

/**
 * A reducer that stores CMS resources grouped by categories.
 *
 * @param schema The schema name of CMS resources.
 * @param settings Collection settings.
 * @returns {*} A reducer that will create a map where
 *   keys represent category IDs, and values resources
 *   in those categories.
 */
export function cmsCollection(
  schema,
  settings = { expirationTime: EXPIRATION_TIME_RESOURCES },
) {
  return mapReducers(getCategoryIds, createCollectionCreator(schema, settings));
}

/**
 * A reducer that stores CMS categories grouped by parent
 * categories.
 *
 * @returns {*} A reducer that will create a map where
 *   keys represent parent category IDs, and values child
 *   categories of those categories.
 */
export function childCategories() {
  return mapReducers(
    getParentCategoryId,
    createCollectionCreator(CATEGORIES_SCHEMA, {
      expirationTime: EXPIRATION_TIME_CATEGORIES,
    }),
  );
}

const initialPermissionState = {
  permission: undefined,
  secondPrompt: false,
};

const permissionReducer = (state = initialPermissionState, action) => {
  const { type, permission, secondPrompt } = action;

  switch (type) {
    case REHYDRATE:
      return {
        ..._.get(action, ['payload', 'shoutem.cms', 'permissionStatus']),
      };
    case UPDATE_LOCATION_PERMISSION:
      return { ...state, permission };
    case UPDATE_SECOND_PROMPT:
      return { ...state, secondPrompt };
    default:
      return state;
  }
};

function assertValidAction(action) {
  if (typeof action.screenId === 'undefined') {
    throw new Error(
      `Invalid action of type '${action.type}': invalid screenId.`,
    );
  }
}

export function screenStateReducer(state = {}, action) {
  switch (action.type) {
    case SET_SCREEN_STATE:
      assertValidAction(action);
      return {
        ...state,
        [action.screenId]: action.screenState,
      };
    case CLEAR_SCREEN_STATE:
      assertValidAction(action);
      return {
        ...state,
        [action.screenId]: undefined,
      };
    default:
      return state;
  }
}

export default combineReducers({
  categories: storage(CATEGORIES_SCHEMA),
  images: storage(IMAGE_ATTACHMENTS_SCHEMA),
  videos: storage(VIDEO_ATTACHMENTS_SCHEMA),
  audio: storage(AUDIO_ATTACHMENTS_SCHEMA),

  childCategories: childCategories(),
  permissionStatus: permissionReducer,
  screenState: preventStateRehydration(screenStateReducer),
});
