import React, { Component } from 'react';
import PropTypes from 'prop-types';
import autoBindReact from 'auto-bind/react';
import _ from 'lodash';
import i18next from 'i18next';
import { LoaderContainer, MultiselectDropdown } from '@shoutem/react-web-ui';
import LOCALIZATION from './localization';
import './style.scss';

export function createCategoryOptions(categories, mainCategoryId) {
  if (_.isEmpty(categories)) {
    return [];
  }

  return _.reduce(
    categories,
    (result, item) => {
      const value = _.get(item, 'id');
      const label = _.get(item, 'name');

      if (value === mainCategoryId) {
        return result;
      }

      if (value && label) {
        result.push({ value, label });
      }

      return result;
    },
    [],
  );
}

export default class CategorySelector extends Component {
  static propTypes = {
    selectedCategories: PropTypes.array,
    categories: PropTypes.array.isRequired,
    mainCategoryId: PropTypes.string.isRequired,
    onSelectionChanged: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    autoBindReact(this);

    this.state = {
      inProgress: false,
    };
  }

  componentWillMount() {
    this.refreshData(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.refreshData(nextProps, this.props);
  }

  refreshData(nextProps, props = {}) {
    const { categories, selectedCategories } = props;
    const {
      categories: nextCategories,
      selectedCategories: nextSelectedCategories,
      mainCategoryId: nextMainCategoryId,
    } = nextProps;

    if (categories !== nextCategories) {
      const categoryOptions = createCategoryOptions(
        nextCategories,
        nextMainCategoryId,
      );
      this.setState({ categoryOptions });
    }

    if (selectedCategories !== nextSelectedCategories) {
      this.setState({
        selectedCategories: _.without(
          nextSelectedCategories,
          nextMainCategoryId,
        ),
      });
    }
  }

  handleSelectionChanged(selectedCategories) {
    const { mainCategoryId, onSelectionChanged } = this.props;
    this.setState({
      inProgress: true,
      selectedCategories,
    });

    const categories = [...selectedCategories, mainCategoryId];

    Promise.resolve(onSelectionChanged(categories))
      .then(() => this.setState({ inProgress: false }))
      .catch(() => this.setState({ inProgress: false }));
  }

  render() {
    const { categoryOptions, inProgress, selectedCategories } = this.state;

    return (
      <LoaderContainer
        className="category-selector"
        isLoading={inProgress}
        isOverlay
        size="24px"
      >
        <MultiselectDropdown
          displayLabelMaxSelectedOptions={1}
          emptyText={i18next.t(LOCALIZATION.EMPTY_PLACEHOLDER_LABEL)}
          onSelectionChanged={this.handleSelectionChanged}
          options={categoryOptions}
          selectNoneText={i18next.t(LOCALIZATION.SELECT_NONE_LABEL)}
          selectAllText={i18next.t(LOCALIZATION.SELECT_ALL_LABEL)}
          selectText={i18next.t(LOCALIZATION.SELECT_LABEL)}
          selectedValues={selectedCategories}
          showSelectNoneOption
          showSelectAllOption
        />
      </LoaderContainer>
    );
  }
}
