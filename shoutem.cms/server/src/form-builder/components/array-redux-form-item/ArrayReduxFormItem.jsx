import React, { Component } from 'react';
import PropTypes from 'prop-types';
import autoBindReact from 'auto-bind/react';
import { ReduxFormElement, FontIcon } from '@shoutem/react-web-ui';
import _ from 'lodash';
import './style.scss';

export default class ArrayReduxFormItem extends Component {
  constructor(props) {
    super(props);
    autoBindReact(this);
  }

  handleRemoveField() {
    const { index, onRemove } = this.props;

    if (_.isFunction(onRemove)) {
      onRemove(index);
    }
  }

  render() {
    const { elementId, field } = this.props;

    return (
      <div className="array-redux-form-item-container">
        <ReduxFormElement
          {...this.props}
          className="field"
          elementId={elementId}
          field={field}
          name={null}
        />
        <FontIcon
          className="close-icon"
          name="close"
          size={25}
          onClick={this.handleRemoveField}
        />
      </div>
    );
  }
}

ArrayReduxFormItem.propTypes = {
  index: PropTypes.number,
  field: PropTypes.object,
  elementId: PropTypes.string,
  onRemove: PropTypes.func,
};
