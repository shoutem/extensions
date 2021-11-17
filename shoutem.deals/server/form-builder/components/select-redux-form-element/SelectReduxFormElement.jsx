import React, { PureComponent } from 'react';
import autoBindReact from 'auto-bind/react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { HelpBlock, ControlLabel, FormGroup } from 'react-bootstrap';
import Select from 'react-select';
import classNames from 'classnames';
import { fieldInError } from '../services';

export default class SelectReduxFormElement extends PureComponent {
  static propTypes = {
    elementId: PropTypes.string,
    name: PropTypes.string,
    field: PropTypes.object,
    helpText: PropTypes.string,
    className: PropTypes.string,
    valueKey: PropTypes.string,
    options: PropTypes.aray,
  };

  static defaultProps = {
    valueKey: 'value',
  };

  constructor(props) {
    super(props);

    autoBindReact(this);
  }

  handleSelectionChanged(newSelectedItem) {
    const { field, valueKey } = this.props;
    const value = _.get(newSelectedItem, valueKey);

    field.onChange(value);
  }

  render() {
    const {
      field,
      name,
      elementId,
      options,
      helpText,
      className,
      ...otherProps
    } = this.props;

    const classes = classNames('select-redux-from-element', className);
    const isError = fieldInError(field);
    const helpBlockText = isError ? field.error : helpText;

    return (
      <FormGroup
        className={classes}
        controlId={elementId}
        validationState={isError ? 'error' : 'success'}
      >
        <ControlLabel>{name}</ControlLabel>
        <Select
          onChange={this.handleSelectionChanged}
          options={options}
          value={field.value}
          {...otherProps}
        />
        {helpBlockText && <HelpBlock>{helpBlockText}</HelpBlock>}
      </FormGroup>
    );
  }
}
