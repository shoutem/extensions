import React from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { connectStyle } from '@shoutem/theme';
import { ScrollView } from '@shoutem/ui';
import { ext } from '../../const';
import Category from './Category';

const categoryShape = PropTypes.shape({
  id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  name: PropTypes.string.isRequired,
  description: PropTypes.string,
});

export function CategoryPicker({
  categories,
  onCategorySelected,
  style,
  selectedCategory,
}) {
  if (_.size(categories) < 2) {
    return null;
  }

  return (
    <ScrollView
      horizontal
      contentContainerStyle={style.container}
      showsHorizontalScrollIndicator={false}
    >
      {_.map(categories, category => (
        <Category
          category={category}
          key={category.id}
          onPress={onCategorySelected}
          isSelected={selectedCategory.id === category.id}
        />
      ))}
    </ScrollView>
  );
}

CategoryPicker.propTypes = {
  categories: PropTypes.arrayOf(categoryShape),
  selectedCategory: categoryShape,
  style: PropTypes.object,
  onCategorySelected: PropTypes.func,
};

CategoryPicker.defaultProps = {
  categories: [],
  style: {},
  selectedCategory: undefined,
  onCategorySelected: undefined,
};

export default React.memo(connectStyle(ext('CategoryPicker'))(CategoryPicker));
