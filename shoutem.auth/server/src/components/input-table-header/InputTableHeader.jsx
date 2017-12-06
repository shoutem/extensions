import React, { Component, PropTypes } from 'react';
import _ from 'lodash';
import classNames from 'classnames';
import DebounceInput from 'react-debounce-input';
import './style.scss';

/**
 * Table header with input component. On input change, callback function from props is called.
 */
export default class InputTableHeader extends Component {
  constructor(props) {
    super(props);

    this.handleInputChange = this.handleInputChange.bind(this);
  }

  handleInputChange(event) {
    const { header, onChange } = this.props;

    const value = event.target.value;
    const newValue = _.isEmpty(value) ? null : value;
    const oldValue = _.get(header, 'value', null);

    if (oldValue === newValue) {
      return;
    }

    onChange(header.id, newValue);
  }

  render() {
    const { className, header } = this.props;
    const classes = classNames('input-table-header', className);
    const inputOptions = _.omit(header, ['type', 'className']);

    return (
      <th className={classes}>
        <DebounceInput
          className="form-control"
          debounceTimeout={300}
          onChange={this.handleInputChange}
          type="text"
          {...inputOptions}
        />
      </th>
    );
  }
}

InputTableHeader.propTypes = {
  /**
   * Header object, containing input value and other input options.
   */
  header: PropTypes.object,
  /**
   * Function called when user input is changed
   */
  onChange: PropTypes.func,
  /**
   * Additional class
   */
  className: PropTypes.string,
};
