import { storage, one } from '@shoutem/redux-io';
import { combineReducers } from 'redux';
import ext from '../../../const';
import { RSS_MONITORS } from '../const';

export const reducer = combineReducers({
  [RSS_MONITORS]: storage(RSS_MONITORS),
  rssMonitor: one(RSS_MONITORS, ext('monitor')),
});
