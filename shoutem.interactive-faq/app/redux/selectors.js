import _ from 'lodash';
import { getCollection } from '@shoutem/redux-io';
import { ext } from '../const';

function getExtensionState(state) {
  return state[ext()];
}

function getQuestions(state) {
  return getCollection(getExtensionState(state).questions, state);
}

function getRootQuestions(state) {
  const questions = getQuestions(state);

  return _.filter(questions, question => _.size(question.categories) < 2);
}

function getCategoryQuestions(categoryId, state) {
  const questions = getQuestions(state);

  return _.filter(questions, question => {
    const matchingCategory = _.find(question.categories, { id: categoryId });

    if (matchingCategory) {
      return true;
    }

    return false;
  });
}

function getActiveCategoryId(state) {
  return getExtensionState(state).levels.activeCategory;
}

function getCategories(state) {
  const allCategories = getCollection(
    getExtensionState(state).categories,
    state,
  );

  return _.filter(allCategories, { autoCreated: false });
}

function getQuestionsPath(state) {
  return getExtensionState(state).levels.categoryPath;
}

function getActiveLevelQuestions(state) {
  const categoryId = getActiveCategoryId(state);
  const categories = getCategories(state);

  // Expand and generalize with level based selector when we support json upload
  if (!categoryId) {
    const rootQuestions = getRootQuestions(state);

    return [...rootQuestions, ...categories];
  }

  return getCategoryQuestions(categoryId, state);
}

export default {
  getCategories,
  getQuestions,
  getActiveLevelQuestions,
  getQuestionsPath,
};
