import React from 'react';
import Select from 'react-select';
import classNames from 'classnames';
import _ from 'lodash';
import PropTypes from 'prop-types';

export default function SelectTableHeader({ className, header, onSelect }) {
  function handleSelectionChanged(selectedItem) {
    const oldValue = _.get(header, 'value', '');
    const newValue = _.get(selectedItem, 'value');

    if (oldValue === newValue) {
      return;
    }

    onSelect(header.id, newValue);
  }

  const classes = classNames('select-table-header', className);

  const selectOptions = _.omit(header, ['type', 'className', 'options']);
  const options = _.get(header, 'options', []);

  return (
    <th className={classes}>
      <Select
        autoBlur
        clearable
        onChange={handleSelectionChanged}
        options={options}
        {...selectOptions}
      />
    </th>
  );
}

SelectTableHeader.propTypes = {
  header: PropTypes.object.isRequired,
  onSelect: PropTypes.func.isRequired,
  className: PropTypes.string,
};

SelectTableHeader.defaultProps = {
  className: null,
};
