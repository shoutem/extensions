import React from 'react';
import PropTypes from 'prop-types';
import { ControlLabel } from 'react-bootstrap';
import { Switch } from '@shoutem/react-web-ui';
import './style.scss';

export default function ToggleSwitch({ message, value, onToggle }) {
  return (
    <div className="toggle-switch">
      <ControlLabel>{message}</ControlLabel>
      <Switch className="pull-right" onChange={onToggle} value={value} />
    </div>
  );
}

ToggleSwitch.propTypes = {
  message: PropTypes.string,
  value: PropTypes.bool,
  onToggle: PropTypes.func,
};
