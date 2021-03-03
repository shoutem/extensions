import React, { Component } from 'react';
import PropTypes from 'prop-types';
import autoBindReact from 'auto-bind/react';
import _ from 'lodash';
import i18next from 'i18next';
import { IconLabel, Dropdown } from '@shoutem/react-web-ui';
import { FormGroup, ControlLabel, MenuItem } from 'react-bootstrap';
import { getDropdownOptions, getSelectedOptionLabel } from '../../services';
import LOCALIZATION from './localization';
import './style.scss';

export default class ParentCategorySelector extends Component {
  constructor(props) {
    super(props);
    autoBindReact(this);
  }

  componentWillMount() {
    this.checkData(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.checkData(nextProps, this.props);
  }

  checkData(nextProps, props = {}) {
    const {
      categories: nextCategories,
      parentCategoryId: nextParentCategoryId,
    } = nextProps;

    const { categories, parentCategoryId } = props;

    if (nextCategories !== categories) {
      this.setState({ options: getDropdownOptions(nextCategories) });
    }

    if (nextParentCategoryId !== parentCategoryId) {
      this.setState({ selectedOptionKey: nextParentCategoryId });
    }
  }

  renderDropdownMenu(selectedOptionLabel) {
    const { options } = this.state;
    const { onCreateCategorySelected } = this.props;

    return (
      <Dropdown.Menu>
        <MenuItem>{selectedOptionLabel}</MenuItem>
        <MenuItem divider />
        {_.map(options, option => (
          <MenuItem eventKey={option.key} key={option.key}>
            {option.label}
          </MenuItem>
        ))}
        {!_.isEmpty(options) && <MenuItem divider />}
        <MenuItem onSelect={onCreateCategorySelected}>
          <IconLabel iconName="add">
            {i18next.t(LOCALIZATION.BUTTON_CREATE_TITLE)}
          </IconLabel>
        </MenuItem>
      </Dropdown.Menu>
    );
  }

  render() {
    const { options, selectedOptionKey } = this.state;
    const { onCategorySelected, schemaTitle } = this.props;

    const noFilteredDataLabel = i18next.t(LOCALIZATION.NO_FILTERED_DATA_TITLE, {
      schemaTitle,
    });
    const selectedOptionLabel = getSelectedOptionLabel(
      options,
      selectedOptionKey,
      noFilteredDataLabel,
    );

    return (
      <FormGroup className="parent-category-selector">
        <ControlLabel>
          {i18next.t(LOCALIZATION.FORM_CHOOSE_DATA_TITLE)}
        </ControlLabel>
        <Dropdown
          className="parent-category-selector__dropdown block"
          id="parent-category-selector__dropdown"
          onSelect={onCategorySelected}
        >
          <Dropdown.Toggle>{selectedOptionLabel}</Dropdown.Toggle>
          {this.renderDropdownMenu(selectedOptionLabel)}
        </Dropdown>
      </FormGroup>
    );
  }
}

ParentCategorySelector.propTypes = {
  categories: PropTypes.array,
  currentCategoryId: PropTypes.string,
  onCategorySelected: PropTypes.func,
  onCreateCategorySelected: PropTypes.func,
  schemaTitle: PropTypes.string,
};
