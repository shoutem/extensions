import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import ToggleElement from './ToggleElement';
import './style.scss';

export default class SubscriptionToggle extends PureComponent {
  render() {
    const { options, selectedOption, onOptionSelected } = this.props;

    return (
      <div className="main-container">
        {_.map(options, option => (
          <ToggleElement
            active={option === selectedOption}
            onToggle={onOptionSelected}
            title={option}
          />
        ))}
      </div>
    );
  }
}

SubscriptionToggle.propTypes = {
  options: PropTypes.array,
  selectedOption: PropTypes.string,
  onOptionSelected: PropTypes.func,
};
