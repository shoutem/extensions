import React, { Component, createRef } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import i18next from 'i18next';
import autoBindReact from 'auto-bind/react';
import { Button, ButtonGroup } from 'react-bootstrap';
import { FontIcon, ReduxFormElement } from '@shoutem/react-web-ui';
import FiltersModal from '../filters-modal';
import LOCALIZATION from './localization';
import './style.scss';

export default class SearchForm extends Component {
  constructor(props) {
    super(props);
    autoBindReact(this);

    this.filtersModal = createRef();
    this.searchField = {};
  }

  handleQueryChange(event) {
    const { onChange, searchOptions } = this.props;

    const query = _.get(event, 'target.value');
    const newSearchOptions = {
      ...searchOptions,
      query,
    };

    if (_.isFunction(onChange)) {
      onChange(newSearchOptions);
    }
  }

  handleQueryClear() {
    const { onChange, searchOptions } = this.props;
    const newSearchOptions = _.omit(searchOptions, ['query']);

    if (_.isFunction(onChange)) {
      onChange(newSearchOptions);
    }
  }

  handleFiltersSubmit(filterOptions) {
    const { onChange, searchOptions } = this.props;

    const newSearchOptions = {
      ...searchOptions,
      ...filterOptions,
    };

    if (_.isFunction(onChange)) {
      onChange(newSearchOptions);
    }
  }

  handleShowFilterModal() {
    const { searchOptions } = this.props;

    const filterOptions = {
      filters: _.get(searchOptions, 'filters'),
    };
    this.filtersModal.current.show({ filterOptions });
  }

  handleResetFilters() {
    this.handleFiltersSubmit({ filters: null });
  }

  render() {
    const { schema, searchOptions, showSearch, showFilter } = this.props;

    const query = _.get(searchOptions, 'query');
    const filters = _.get(searchOptions, 'filters');
    const hasFilters = _.isEmpty(filters);

    return (
      <div className="search-form">
        {showSearch && (
          <div className="search-input-container">
            <FontIcon className="search-input-icon" name="search" size="25px" />
            <ReduxFormElement
              className="search-input"
              placeholder={i18next.t(LOCALIZATION.SEARCH)}
              onChange={this.handleQueryChange}
              value={query || ''}
              field={this.searchField}
            />
            {query && (
              <FontIcon
                className="close-input-icon"
                name="close"
                size="25px"
                onClick={this.handleQueryClear}
              />
            )}
          </div>
        )}
        {showFilter && (
          <div className="filter-button-container">
            {hasFilters && (
              <Button
                bsSize="large"
                className="add-filter-btn"
                onClick={this.handleShowFilterModal}
              >
                {i18next.t(LOCALIZATION.ADD_FILTER)}
              </Button>
            )}
            {!hasFilters && (
              <ButtonGroup>
                <Button
                  bsSize="large"
                  bsStyle="primary"
                  className="edit-filter-btn"
                  onClick={this.handleShowFilterModal}
                >
                  {i18next.t(LOCALIZATION.EDIT_FILTER)}
                </Button>
                <Button
                  bsSize="large"
                  bsStyle="primary"
                  className="reset-filter-btn"
                  onClick={this.handleResetFilters}
                >
                  <FontIcon name="close" size="24px" />
                </Button>
              </ButtonGroup>
            )}
          </div>
        )}
        <FiltersModal
          className="filters-modal"
          ref={this.filtersModal}
          schema={schema}
          onSubmit={this.handleFiltersSubmit}
        />
      </div>
    );
  }
}

SearchForm.propTypes = {
  schema: PropTypes.object,
  showSearch: PropTypes.bool,
  showFilter: PropTypes.bool,
  searchOptions: PropTypes.object,
  onChange: PropTypes.func,
};
