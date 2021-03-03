import _ from 'lodash';

function extractCategoriesFromUrl(feedUrl) {
  const hasCategories = feedUrl.includes('/category/');

  const categoriesString = feedUrl.slice(
    feedUrl.lastIndexOf('/category/') + 10,
  );
  const categories = categoriesString.split('/');

  return hasCategories ? categories : [];
}

export default function createCategoryFilter(feedUrl, categories) {
  // 'slug' is the actual string name of the category in the URL, e.g. 'latest-news'.
  const categorySlugs = extractCategoriesFromUrl(feedUrl);

  if (!categorySlugs.length) {
    return '';
  }

  const categoryIds = [];
  _.forEach(categorySlugs, slug => {
    const category = _.find(categories, { slug }, false);

    if (category) {
      categoryIds.push(category.id);
    }
  });

  return categoryIds.length ? `&categories=${categoryIds.join(',')}` : '';
}
