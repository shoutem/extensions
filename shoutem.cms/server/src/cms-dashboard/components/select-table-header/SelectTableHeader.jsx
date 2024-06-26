import React, { Component } from 'react';
import Select from 'react-select';
import autoBindReact from 'auto-bind/react';
import classNames from 'classnames';
import _ from 'lodash';
import PropTypes from 'prop-types';

/**
 * Table header with select component. On selection change, callback function from props is called.
 */
export default class SelectTableHeader extends Component {
  constructor(props) {
    super(props);
    autoBindReact(this);
  }

  handleSelectionChanged(selectedItem) {
    const { header, onSelect } = this.props;

    const oldValue = _.get(header, 'value', '');
    const newValue = _.get(selectedItem, 'value');

    if (oldValue === newValue) {
      return;
    }

    onSelect(header.id, newValue);
  }

  render() {
    const { header, className } = this.props;
    const classes = classNames('select-table-header', className);

    const selectOptions = _.omit(header, ['type', 'className', 'options']);
    const options = _.get(header, 'options', []);

    return (
      <th className={classes}>
        <Select
          autoBlur
          clearable
          onChange={this.handleSelectionChanged}
          options={options}
          {...selectOptions}
        />
      </th>
    );
  }
}

SelectTableHeader.propTypes = {
  /**
   * Header object, containing available optiosn, currently selected value and other select options.
   */
  header: PropTypes.object,
  /**
   * Function called when new option is selected
   */
  onSelect: PropTypes.func,
  /**
   * Additional class
   */
  className: PropTypes.string,
};
