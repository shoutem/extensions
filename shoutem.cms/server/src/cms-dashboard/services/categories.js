import _ from 'lodash';

export function isMainCategory(category) {
  const { index, autoCreated } = category;
  return autoCreated && index === 0;
}

function isChildCategory(category, parentCategoryId) {
  const categoryParent = _.get(category, 'parent', {});
  return categoryParent.id === parentCategoryId;
}

export function getMainCategoryId(parentCategoryId, categories) {
  const mainCategory = _.find(
    categories,
    category =>
      isMainCategory(category) && isChildCategory(category, parentCategoryId),
  );

  return _.get(mainCategory, 'id', null);
}
