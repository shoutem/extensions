import React, { Component, PropTypes } from 'react';
import _ from 'lodash';
import i18next from 'i18next';
import { LoaderContainer, MultiselectDropdown } from '@shoutem/react-web-ui';
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

    this.refreshData = this.refreshData.bind(this);
    this.handleSelectionChanged = this.handleSelectionChanged.bind(this);

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
          emptyText={i18next.t('None')}
          onSelectionChanged={this.handleSelectionChanged}
          options={categoryOptions}
          selectNoneText={i18next.t('None')}
          selectedValues={selectedCategories}
          showSelectNoneOption
        />
      </LoaderContainer>
    );
  }
}
