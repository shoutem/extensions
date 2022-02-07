import React from 'react';
import { ControlLabel } from 'react-bootstrap';
import i18next from 'i18next';
import PropTypes from 'prop-types';
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
