import React from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';

const MAX_LENGTH = 70;

export default function UserTableProfileCell({ value }) {
  if (!value) {
    return <td />;
  }

  const resolvedValue = _.isArray(value) ? value.join(', ') : value;

  if (resolvedValue?.length < MAX_LENGTH) {
    return <td>{resolvedValue}</td>;
  }

  const slicedString = `${resolvedValue.slice(0, MAX_LENGTH)}...`;

  return <td>{slicedString}</td>;
}

UserTableProfileCell.propTypes = {
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
};

UserTableProfileCell.defaultProps = {
  value: '',
};
