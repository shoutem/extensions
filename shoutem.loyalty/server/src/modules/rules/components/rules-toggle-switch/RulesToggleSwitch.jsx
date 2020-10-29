import React from 'react';
import PropTypes from 'prop-types';
import i18next from 'i18next';
import { ControlLabel } from 'react-bootstrap';
import { Switch } from '@shoutem/react-web-ui';
import LOCALIZATION from './localization';
import './style.scss';

export default function RulesToggleSwitch({ value, onToggle }) {
  return (
    <div className="rules-toggle-switch">
      <ControlLabel>{i18next.t(LOCALIZATION.TITLE)}</ControlLabel>
      <Switch className="pull-right" onChange={onToggle} value={value} />
    </div>
  );
}

RulesToggleSwitch.propTypes = {
  value: PropTypes.bool,
  onToggle: PropTypes.func,
};
