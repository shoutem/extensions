import _ from 'lodash';
import { invalidate } from '@shoutem/redux-io';

import { ext } from '../const';

export const UPDATE_LOCATION_PERMISSION =
  'shoutem.cms.UPDATE_LOCATION_PERMISSION';
export const UPDATE_SECOND_PROMPT = 'shoutem.cms.UPDATE_SECOND_PROMPT';
export const SET_SCREEN_STATE = ext('SET_SCREEN_STATE');
export const CLEAR_SCREEN_STATE = ext('CLEAR_SCREEN_STATE');

/**
 * Invalidate any CMS schema that was previously
 * fetched via category ID ( Most of CmsListScreen components )
 */
export function invalidateLoadedCollections() {
  return (dispatch, getState) => {
    const state = getState();
    const categories = state[ext()].categories;

    const schemas = _.map(categories, category => {
      return _.get(category, 'relationships.schema.data.id');
    });

    const uniqueSchemas = _.compact(_.uniq(schemas));
    const actions = _.map(uniqueSchemas, schema =>
      dispatch(invalidate(schema)),
    );

    return Promise.all(actions);
  };
}

export const updateLocationPermission = permission => {
  return { type: UPDATE_LOCATION_PERMISSION, permission };
};

export const updateSecondPromptStatus = secondPrompt => {
  return { type: UPDATE_SECOND_PROMPT, secondPrompt };
};

export const setScreenState = (screenId, screenState) => ({
  type: SET_SCREEN_STATE,
  screenId,
  screenState,
});

export const clearScreenState = screenId => ({
  type: CLEAR_SCREEN_STATE,
  screenId,
});
