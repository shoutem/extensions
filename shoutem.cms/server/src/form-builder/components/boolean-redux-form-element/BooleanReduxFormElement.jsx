import React, { Component } from 'react';
import PropTypes from 'prop-types';
import autoBindReact from 'auto-bind/react';
import { HelpBlock, FormGroup } from 'react-bootstrap';
import classNames from 'classnames';
import { Switch } from '@shoutem/react-web-ui';
import { fieldInError } from '../services';
import './style.scss';

export default class BooleanReduxFormElement extends Component {
  static propTypes = {
    elementId: PropTypes.string,
    name: PropTypes.string,
    field: PropTypes.object,
    helpText: PropTypes.string,
    className: PropTypes.string,
  };

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
