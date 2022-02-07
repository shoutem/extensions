import { combineReducers } from 'redux';
import { storage } from '@shoutem/redux-io';
import { cmsCollection } from 'shoutem.cms';
import { ext } from '../const';
import { SET_CARD_ID, SET_CARD_POINTS, SET_LOADING } from './actions';

const cardInitialState = {
  cardId: '',
  points: 0,
  loading: false,
};

function cardReducer(state = cardInitialState, action) {
  if (action.type === SET_CARD_ID) {
    return { ...state, cardId: action.payload };
  }

  if (action.type === SET_CARD_POINTS) {
    return { ...state, points: action.payload, loading: false };
  }

  if (action.type === SET_LOADING) {
    return { ...state, loading: action.payload };
  }

  return state;
}

export default combineReducers({
  card: cardReducer,
  levels: storage(ext('levels')),
  allLevels: cmsCollection(ext('levels')),
});
