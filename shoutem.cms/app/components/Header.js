import React from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { CategoryPicker, DropDownMenu } from '@shoutem/ui';
import SearchInput from './SearchInput';

function Header({
  categories,
  categoryPickerType,
  selectedCategory,
  onCategorySelected,
  onSearchTextChange,
  onClearSearchText,
  searchText,
  shouldRenderSearch,
}) {
  const shouldRenderPicker =
    categories.length > 1 && _.has(selectedCategory, 'id');
  const renderInlineCategoryPicker =
    shouldRenderPicker && categoryPickerType === 'dropdown';
  const renderHorizontalListCategoryPicker =
    shouldRenderPicker && categoryPickerType === 'horizontalList';

  return (
    <>
      {shouldRenderSearch && (
        <SearchInput
          onChangeText={onSearchTextChange}
          onClearPress={onClearSearchText}
          input={searchText}
        />
      )}
      {renderInlineCategoryPicker && (
        <DropDownMenu
          styleName="horizontal"
          options={categories}
          titleProperty="name"
          valueProperty="id"
          onOptionSelected={onCategorySelected}
          selectedOption={selectedCategory}
          showSelectedOption
          iconName="down-arrow"
        />
      )}
      {renderHorizontalListCategoryPicker && (
        <CategoryPicker
          categories={categories}
          selectedCategory={selectedCategory}
          onCategorySelected={onCategorySelected}
        />
      )}
    </>
  );
}

Header.propTypes = {
  onCategorySelected: PropTypes.func.isRequired,
  onClearSearchText: PropTypes.func.isRequired,
  onSearchTextChange: PropTypes.func.isRequired,
  categories: PropTypes.array,
  categoryPickerType: PropTypes.string,
  searchText: PropTypes.string,
  selectedCategory: PropTypes.object,
  shouldRenderSearch: PropTypes.bool,
};

Header.defaultProps = {
  categories: [],
  categoryPickerType: 'dropdown',
  searchText: '',
  selectedCategory: {},
  shouldRenderSearch: false,
};

export default React.memo(Header);
