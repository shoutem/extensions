import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import autoBindReact from 'auto-bind/react';
import './style.scss';

export default class ToggleElement extends PureComponent {
  constructor(props) {
    super(props);

    autoBindReact(this);
  }

  handleTogglePress() {
    const { onToggle, active, title } = this.props;

    if (!onToggle || active) {
      return;
    }

    onToggle(title);
  }

  render() {
    const { active, title } = this.props;

    const className = active
      ? 'toggle-container-active'
      : 'toggle-container-inactive';

    return (
      <div className={className} onClick={this.handleTogglePress}>
        <div className="toggle-indicator" />
        <div className="toggle-title">{title}</div>
      </div>
    );
  }
}

ToggleElement.propTypes = {
  active: PropTypes.bool,
  title: PropTypes.string,
  onToggle: PropTypes.func,
};
