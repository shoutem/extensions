import React, { PropTypes } from 'react';
import { Button } from 'react-bootstrap';
import { FontIcon } from '@shoutem/react-web-ui';

export default function TableRowActionButton({ onClick, disabled, iconName }) {
  return (
    <Button
      className="btn-icon"
      onClick={onClick}
      disabled={disabled}
    >
      <FontIcon name={iconName} size="24" />
    </Button>
  );
}

TableRowActionButton.propTypes = {
  onClick: PropTypes.func.isRequired,
  iconName: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
};

TableRowActionButton.defaultProps = {
  disabled: false,
};
