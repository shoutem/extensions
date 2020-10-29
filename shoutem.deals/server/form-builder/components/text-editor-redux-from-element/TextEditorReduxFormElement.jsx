import React, { Component, PropTypes } from 'react';
import _ from 'lodash';
import i18next from 'i18next';
import { HelpBlock, ControlLabel, FormGroup } from 'react-bootstrap';
import RichTextEditor from 'react-rte';
import classNames from 'classnames';
import { fieldInError } from '../services';
import LOCALIZATION from './localization';
import './style.scss';

function getToolbarConfig() {
  return  {
    display: [
      'INLINE_STYLE_BUTTONS',
      'BLOCK_TYPE_BUTTONS',
      'LINK_BUTTONS',
      'BLOCK_TYPE_DROPDOWN',
      'HISTORY_BUTTONS',
    ],
    INLINE_STYLE_BUTTONS: [
      { label: i18next.t(LOCALIZATION.TEXT_STYLE_BOLD_TITLE), style: 'BOLD', className: 'custom-css-class' },
      { label: i18next.t(LOCALIZATION.TEXT_STYLE_ITALIC_TITLE), style: 'ITALIC' },
      { label: i18next.t(LOCALIZATION.TEXT_STYLE_UNDERLINE_TITLE), style: 'UNDERLINE' },
    ],
    BLOCK_TYPE_DROPDOWN: [
      { label: i18next.t(LOCALIZATION.HEADING_STYLE_NORMAL_TITLE), style: 'unstyled' },
      { label: i18next.t(LOCALIZATION.HEADING_STYLE_LARGE_TITLE), style: 'header-one' },
      { label: i18next.t(LOCALIZATION.HEADING_STYLE_MEDIUM_TITLE), style: 'header-two' },
      { label: i18next.t(LOCALIZATION.HEADING_STYLE_SMALL_TITLE), style: 'header-three' },
    ],
    BLOCK_TYPE_BUTTONS: [
      { label: i18next.t(LOCALIZATION.UNORDERED_LIST_TITLE), style: 'unordered-list-item' },
      { label: i18next.t(LOCALIZATION.ORDERED_LIST_TITLE), style: 'ordered-list-item' },
    ],
  };
}

export default class TextEditorReduxFormElement extends Component {
  static propTypes = {
    elementId: PropTypes.string,
    name: PropTypes.string,
    field: PropTypes.object,
    helpText: PropTypes.string,
    className: PropTypes.string,
  };

  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
    this.handleBlur = this.handleBlur.bind(this);

    const { field } = props;
    const initialValue = _.get(field, 'value', '');

    this.state = {
      value: RichTextEditor.createValueFromString(initialValue, 'html'),
    };
  }

  handleChange(value) {
    this.setState({ value });
  }

  handleBlur() {
    const { value } = this.state;
    const { field } = this.props;
    field.onChange(value.toString('html'));
  }

  render() {
    const {
      elementId,
      field,
      name,
      helpText,
      className,
      ...otherProps,
    } = this.props;

    const classes = classNames('text-editor-redux-from-element', className);
    const isError = fieldInError(field);
    const helpBlockText = isError ? field.error : helpText;

    return (
      <FormGroup
        className={classes}
        controlId={elementId}
        validationState={isError ? 'error' : 'success'}
      >
        <ControlLabel>{name}</ControlLabel>
        <RichTextEditor
          onBlur={this.handleBlur}
          onChange={this.handleChange}
          toolbarConfig={getToolbarConfig()}
          value={this.state.value}
          {...otherProps}
        />
        {helpBlockText && <HelpBlock>{helpBlockText}</HelpBlock>}
      </FormGroup>
    );
  }
}
