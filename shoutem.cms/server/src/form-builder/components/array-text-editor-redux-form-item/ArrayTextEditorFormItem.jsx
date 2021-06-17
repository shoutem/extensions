import React, { Component } from 'react';
import PropTypes from 'prop-types';
import autoBindReact from 'auto-bind/react';
import i18next from 'i18next';
import { RichTextEditor } from '@shoutem/react-web-ui';
import _ from 'lodash';
import LOCALIZATION from '../../localization';
import './style.scss';

export default class ArrayTextEditorFormItem extends Component {
  constructor(props) {
    super(props);
    autoBindReact(this);

    const { field } = props;
    const initialValue = _.get(field, 'value', '');

    this.state = {
      value: initialValue,
    };
  }

  handleRemoveField() {
    const { index, onRemove } = this.props;

    if (_.isFunction(onRemove)) {
      onRemove(index);
    }
  }

  handleChange(value) {
    const { field } = this.props;

    this.setState({ value });
    field.onChange(value.toString('html'));
  }

  render() {
    const { value } = this.state;

    return (
      <div className="array-text-editor-form-item-container">
        <div className="remove-btn" onClick={this.handleRemoveField}>
          {i18next.t(LOCALIZATION.REMOVE_SECTION)}
        </div>
        <div className="editor">
          <RichTextEditor
            {...this.props}
            onChange={this.handleChange}
            value={value}
          />
        </div>
      </div>
    );
  }
}

ArrayTextEditorFormItem.propTypes = {
  index: PropTypes.number,
  field: PropTypes.object,
  elementId: PropTypes.string,
  onRemove: PropTypes.func,
};
