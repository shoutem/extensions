import { combineReducers } from 'redux';
import { storage } from '@shoutem/redux-io';
import { cmsCollection } from 'shoutem.cms';
import { ext } from '../const';

export default combineReducers({
  pageInfo: storage(ext('Page')),
  allPage: cmsCollection(ext('Page')),
});
