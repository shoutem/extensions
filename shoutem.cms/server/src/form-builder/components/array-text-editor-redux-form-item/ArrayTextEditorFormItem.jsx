import React, { Component } from 'react';
import PropTypes from 'prop-types';
import autoBindReact from 'auto-bind/react';
import { unsplashAccessKey } from 'environment';
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

    const imagePickerLocalization = {
      emptySearchTermTitle: LOCALIZATION.EMPTY_SEARCH_TERM_TITLE,
      emptySearchTermDescription: LOCALIZATION.EMPTY_SEARCH_TERM_DESCRITION,
      emptySearchResultsTitle: LOCALIZATION.EMPTY_SEARCH_RESULTS_TITLE,
      emptySearchResultsDescription:
        LOCALIZATION.EMPTY_SEARCH_RESULTS_DESCRIPTION,
      footerText: i18next.t(LOCALIZATION.IMAGE_PICKER_FOOTER_TEXT),
      insertButtonTextSingular: i18next.t(
        LOCALIZATION.IMAGE_PICKER_INSERT_BUTTON_TEXT_SINGULAR,
      ),
      insertButtonTextPlural: i18next.t(
        LOCALIZATION.IMAGE_PICKER_INSERT_BUTTON_TEXT_PLURAL,
      ),
      invalidUnsplashKeyText: i18next.t(
        LOCALIZATION.IMAGE_PICKER_INVALID_ACCESS_KEY_TEXT,
      ),
      modalTitle: i18next.t(LOCALIZATION.IMAGE_PICKER_MODAL_TITLE),
      imagePreviewOnText: i18next.t(LOCALIZATION.IMAGE_PICKER_ON_TEXT),
      imagePreviewPhotoByText: i18next.t(
        LOCALIZATION.IMAGE_PICKER_PHOTO_BY_TEXT,
      ),
      imagePreviewUnsplashText: i18next.t(
        LOCALIZATION.IMAGE_PICKER_UNSPLASH_TEXT,
      ),
      maxText: i18next.t(LOCALIZATION.MAX_TEXT),
      searchPlaceholder: i18next.t(
        LOCALIZATION.IMAGE_PICKER_SEARCH_PLACEHOLDER,
      ),
      searchTabTitle: i18next.t(LOCALIZATION.IMAGE_PICKER_SEARCH_TAB_TITLE),
    };

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
            imagePickerLocalization={imagePickerLocalization}
            imagePickerOptions={{ unsplashAccessKey }}
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
