import React from 'react';
import DebounceInput from 'react-debounce-input';
import classNames from 'classnames';
import _ from 'lodash';
import PropTypes from 'prop-types';
import './style.scss';

export default function InputTableHeader({ className, header, onChange }) {
  function handleInputChange(event) {
    const { value } = event.target;
    const newValue = _.isEmpty(value) ? null : value;
    const oldValue = _.get(header, 'value', null);

    if (oldValue === newValue) {
      return;
    }

    onChange(header.id, newValue);
  }

  const classes = classNames('input-table-header', className);
  const inputOptions = _.omit(header, ['type', 'className']);

  return (
    <th className={classes}>
      <DebounceInput
        className="form-control"
        debounceTimeout={300}
        onChange={handleInputChange}
        type="text"
        {...inputOptions}
      />
    </th>
  );
}

InputTableHeader.propTypes = {
  header: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  className: PropTypes.string,
};

InputTableHeader.defaultProps = {
  className: null,
};
