import React, { Component } from 'react';
import { ControlLabel, FormGroup } from 'react-bootstrap';
import Select from 'react-select';
import autoBindReact from 'auto-bind/react';
import i18next from 'i18next';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { LoaderContainer } from '@shoutem/react-web-ui';
import { isBusy } from '@shoutem/redux-io';
import LOCALIZATION from './localization';

const getDefaultFilerItem = allItemsLabel => ({
  value: 'all',
  label: allItemsLabel,
});

export default class CmsSelect extends Component {
  constructor(props) {
    super(props);
    autoBindReact(this);

    const { allItemsLabel, defaultValue } = props;
    const defaultFilterItem = getDefaultFilerItem(allItemsLabel);

    this.state = {
      defaultFilterItem,
      filterItems: [defaultFilterItem],
      selectedValue: defaultValue || defaultFilterItem.value,
    };
  }

  componentWillMount() {
    this.resolveStateFromProps(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.resolveStateFromProps(nextProps);
  }

  resolveStateFromProps(props) {
    const { resources, descriptor, sortItems } = props;
    const { defaultFilterItem } = this.state;

    const keyProp = _.get(descriptor, 'filterKeyProp', 'id');
    const labelProp = _.get(descriptor, 'filterLabelProp', 'name');

    const filterItems = _.reduce(
      resources,
      (result, resource) => {
        const value = _.get(resource, keyProp);
        const label = _.get(resource, labelProp);

        if (!value || !label) {
          return result;
        }

        return [...result, { value, label }];
      },
      [defaultFilterItem],
    );

    const sortedFilterItems = sortItems(filterItems);

    this.setState({ filterItems: sortedFilterItems });
  }

  handleFilterChange(selectedItem) {
    const { onFilterChange } = this.props;
    const { defaultFilterItem } = this.state;

    const { value } = selectedItem;
    this.setState({ selectedValue: value });

    const filterValue = selectedItem === defaultFilterItem ? null : value;
    onFilterChange(filterValue);
  }

  render() {
    const { dropdownLabel, resources, disabled } = this.props;
    const { selectedValue, filterItems } = this.state;

    return (
      <LoaderContainer
        className="cms-dropdown-filter"
        isLoading={isBusy(resources)}
        isOverlay
      >
        <FormGroup>
          <ControlLabel>{dropdownLabel}</ControlLabel>
          <Select
            autoBlur
            clearable={false}
            disabled={disabled}
            onChange={this.handleFilterChange}
            options={filterItems}
            value={selectedValue}
          />
        </FormGroup>
      </LoaderContainer>
    );
  }
}

CmsSelect.propTypes = {
  descriptor: PropTypes.object,
  dropdownLabel: PropTypes.string,
  resources: PropTypes.array,
  allItemsLabel: PropTypes.string,
  onFilterChange: PropTypes.func,
  defaultValue: PropTypes.string,
  sortItems: PropTypes.func,
  disabled: PropTypes.bool,
};

CmsSelect.defaultProps = {
  dropdownLabel: i18next.t(LOCALIZATION.DROPDOWN_TITLE),
  allItemsLabel: i18next.t(LOCALIZATION.ALL_ITEMS_TITLE),
  sortItems: items => _.sortBy(items, 'label'),
  disabled: false,
};
