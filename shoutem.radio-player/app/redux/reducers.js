import _ from 'lodash';
import { combineReducers } from 'redux';
import { storage } from '@shoutem/redux-io';
import { preventStateRehydration } from 'shoutem.redux';
import { rssFeed } from 'shoutem.rss';
import { REMOVE_RADIO_METADATA, SET_RADIO_METADATA } from './actions';

export const RSS_NEWS_SCHEMA = 'shoutem.proxy.news';
export const NEWS_COLLECTION_TAG = 'latestNews';

const radioMetadata = (state = {}, action) => {
  if (action.type === SET_RADIO_METADATA) {
    const { id, metadata } = action.payload;

    return { ...state, [id]: { ...state[id], ...metadata } };
  }

  if (action.type === REMOVE_RADIO_METADATA) {
    const newState = { ...state };

    return _.omit(newState, [action.payload]);
  }

  return state;
};

export default preventStateRehydration(
  combineReducers({
    radioMetadata,
    news: storage(RSS_NEWS_SCHEMA),
    latestNews: rssFeed(RSS_NEWS_SCHEMA, NEWS_COLLECTION_TAG),
  }),
);
