import React, { Component } from 'react';
import { Checkbox } from 'react-bootstrap';
import autoBindReact from 'auto-bind/react';
import PropTypes from 'prop-types';
import './style.scss';

export default class CheckboxMenuItem extends Component {
  constructor(props) {
    super(props);
    autoBindReact(this);
  }

  handleToggle() {
    const { id, checked, onToggle } = this.props;
    onToggle(id, !checked);
  }

  render() {
    const { label, checked, disabled } = this.props;
    return (
      <Checkbox
        checked={checked}
        className="checkbox-menu-item"
        disabled={disabled}
        onChange={this.handleToggle}
      >
        {label}
      </Checkbox>
    );
  }
}

CheckboxMenuItem.propTypes = {
  checked: PropTypes.bool,
  disabled: PropTypes.bool,
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  onToggle: PropTypes.func,
};
