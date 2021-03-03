import { combineReducers } from 'redux';
import { cmsCollection } from 'shoutem.cms';
import { storage } from '@shoutem/redux-io';
import { ext } from '../const';

export default combineReducers({
  people: storage(ext('People')),
  allPeople: cmsCollection(ext('People')),
});
