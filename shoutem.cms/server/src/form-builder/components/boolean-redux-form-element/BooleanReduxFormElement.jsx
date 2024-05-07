import React, { Component } from 'react';
import { FormGroup, HelpBlock } from 'react-bootstrap';
import autoBindReact from 'auto-bind/react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { Switch } from '@shoutem/react-web-ui';
import { fieldInError } from '../services';
import './style.scss';

export default class BooleanReduxFormElement extends Component {
  constructor(props) {
    super(props);
    autoBindReact(this);
  }

  handleChange() {
    const { field } = this.props;
    field.onChange(!field.value);
  }

  render() {
    const {
      field,
      name,
      elementId,
      helpText,
      className,
      ...otherProps
    } = this.props;

    const classes = classNames('bool-redux-form-element', className);
    const isError = fieldInError(field);
    const helpBlockText = isError ? field.error : helpText;

    return (
      <FormGroup
        className={classes}
        controlId={elementId}
        validationState={isError ? 'error' : 'success'}
      >
        {name && <div className="form-name">{name}</div>}
        <Switch
          onChange={this.handleChange}
          value={field.value}
          {...otherProps}
        />
        {helpBlockText && <HelpBlock>{helpBlockText}</HelpBlock>}
      </FormGroup>
    );
  }
}

BooleanReduxFormElement.propTypes = {
  elementId: PropTypes.string,
  name: PropTypes.string,
  field: PropTypes.object,
  helpText: PropTypes.string,
  className: PropTypes.string,
};
