import PropTypes from 'prop-types';
import React, { Component } from 'react';
import _ from 'lodash';
import autoBindReact from 'auto-bind/react';
import { Checkbox } from '@shoutem/react-web-ui';
import './style.scss';

export default class StateRow extends Component {
  constructor(props) {
    super(props);
    autoBindReact(this);
  }

  handleCheckedChange() {
    const { onStateSelect, state } = this.props;

    return onStateSelect(state);
  }

  render() {
    const { allowedStates, state } = this.props;
    const stateCode = _.get(state, 'abbreviation');
    const isChecked = _.indexOf(allowedStates, stateCode) >= 0;

    return (
      <div className="state-row">
        <Checkbox onChange={this.handleCheckedChange} checked={isChecked}>
          {state.name}
        </Checkbox>
      </div>
    );
  }
}

StateRow.propTypes = {
  allowedStates: PropTypes.array,
  state: PropTypes.object,
  onStateSelect: PropTypes.func,
};
