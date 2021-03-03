import React, { Component } from 'react';
import PropTypes from 'prop-types';
import autoBindReact from 'auto-bind/react';
import _ from 'lodash';
import { ControlLabel, FormGroup } from 'react-bootstrap';
import { FontIcon } from '@shoutem/react-web-ui';
import ArrayReduxFormItem from './ArrayReduxFormItem';
import './style.scss';

export default class ArrayReduxFormElement extends Component {
  static propTypes = {
    elementId: PropTypes.string,
    name: PropTypes.string,
    field: PropTypes.object,
  };

  constructor(props) {
    super(props);
    autoBindReact(this);

    const { field } = props;

    // add empty field if there is no fields
    if (_.isEmpty(field)) {
      field.addField();
    }
  }

  handleRemoveField(index) {
    const { field } = this.props;

    if (field) {
      field.removeField(index);
      _.set(field, 'touched', true);
    }
  }

  handleAddField() {
    const { field } = this.props;

    if (field) {
      field.addField();
    }
  }

  render() {
    const { name, elementId, field } = this.props;

    return (
      <FormGroup className="array-form" controlId={elementId}>
        <ControlLabel>{name}</ControlLabel>
        <div className="fields-container">
          {_.map(field, (fieldItem, index) => (
            <ArrayReduxFormItem
              index={index}
              field={fieldItem}
              elementId={_.get(fieldItem, 'name')}
              onRemove={this.handleRemoveField}
            />
          ))}
        </div>
        <div className="add-more-container" onClick={this.handleAddField}>
          <FontIcon className="add-more-icon" name="add" size={25} />
          <div className="add-more-text">Add more</div>
        </div>
      </FormGroup>
    );
  }
}
