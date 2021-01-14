import React from 'react';
import PropTypes from 'prop-types';
import './style.scss';

export default function TextTableColumn({ value }) {
  return <div className="text-table-column">{value}</div>;
}

TextTableColumn.propTypes = {
  value: PropTypes.string,
};
