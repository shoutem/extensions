import { combineReducers } from 'redux';
import { cmsCollection } from 'shoutem.cms';
import { storage, collection } from '@shoutem/redux-io';
import { ext } from './const';

export default combineReducers({
  books: storage(ext('Books')),
  allBooks: cmsCollection(ext('Books')),
  favoriteBooks: collection(ext('Books'), 'favorite'),
});
