import { find } from '@shoutem/redux-io';
import { CATEGORIES_SCHEMA } from 'shoutem.cms';
import { ext } from '../const';
import { QUESTIONS_SCHEMA } from './const';

export const GO_BACK_ACTION = 'shoutem.interactive-faq.GO_BACK';
export const OPEN_CATEGORY_ACTION = 'shoutem.interactive-faq.OPEN_CATEGORY';

export function goBackALevel() {
  return {
    type: GO_BACK_ACTION,
  };
}

export function openCategory(categoryId) {
  return {
    type: OPEN_CATEGORY_ACTION,
    payload: categoryId,
  };
}

export function loadCategories(parentCategoryId) {
  return find(CATEGORIES_SCHEMA, 'levelCategories', {
    query: {
      'filter%5Bschema%5B': ext(),
      'filter[parent]': parentCategoryId,
      'page[limit]': 2000,
    },
  });
}

export function loadQuestions() {
  return find(QUESTIONS_SCHEMA, 'questions', {
    'page[limit]': 2000,
  });
}

export default {
  goBackALevel,
  openCategory,
  loadCategories,
  loadQuestions,
};
