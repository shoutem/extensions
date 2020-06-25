import { combineReducers } from 'redux';
import { preventStateRehydration } from 'shoutem.redux';
import _ from 'lodash';
import { CATEGORIES_SCHEMA } from 'shoutem.cms';
import { storage, collection } from '@shoutem/redux-io';
import { OPEN_CATEGORY_ACTION, GO_BACK_ACTION } from './actions';
import { QUESTIONS_SCHEMA } from './const';

const initialState = {
  activeCategory: null,
  categoryPath: [],
};

const levelReducer = (state = initialState, action) => {
  if (action.type === OPEN_CATEGORY_ACTION) {
    return {
      activeCategory: action.payload,
      categoryPath: [...state.categoryPath, action.payload],
    };
  }

  if (action.type === GO_BACK_ACTION) {
    const categoryPath = _.size(state.categoryPath) > 1 ? _.dropRight(state.categoryPath) : [];
    const activeCategory = _.last(categoryPath) || null;

    return { categoryPath, activeCategory };
  }

  return state;
};

const reducer = combineReducers({
  categories: collection(CATEGORIES_SCHEMA, 'levelCategories'),
  questions: collection(QUESTIONS_SCHEMA, 'questions'),
  questionsStorage: storage(QUESTIONS_SCHEMA),
  levels: levelReducer,
});

export default preventStateRehydration(reducer);
