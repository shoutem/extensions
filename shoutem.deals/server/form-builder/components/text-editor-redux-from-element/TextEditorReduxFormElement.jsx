import React, { Component } from 'react';
import { ControlLabel, FormGroup, HelpBlock } from 'react-bootstrap';
import autoBindReact from 'auto-bind/react';
import classNames from 'classnames';
import i18next from 'i18next';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { RichTextEditor } from '@shoutem/react-web-ui';
import { fieldInError, resolveCdnUrl } from '../services';
import './style.scss';

function resolveFilename(file) {
  const timestamp = new Date().getTime();
  const fileName = file.name ? `${timestamp}-${file.name}` : `${timestamp}`;

  return fileName;
}

export default class TextEditorReduxFormElement extends Component {
  constructor(props) {
    super(props);
    autoBindReact(this);

    const { field } = props;
    const initialValue = _.get(field, 'value', '');

    this.state = {
      value: initialValue,
    };
  }

  handleChange(value) {
    const { field } = this.props;

    this.setState({ value });
    field.onChange(value.toString('html'));
  }

  validateFileSize(file) {
    const { maxFileSize } = this.props;

    if (file.size > maxFileSize) {
      // reusig image upload localization
      return i18next.t('image-uploader.max-size-message', {
        maxSize: maxFileSize / 1000000,
      });
    }

    return null;
  }

  async handleImageUpload(file) {
    const { assetManager, folderName } = this.props;

    if (!file) {
      return null;
    }

    const fileSizeError = this.validateFileSize(file);
    if (fileSizeError) {
      throw new Error(fileSizeError);
    }

    const resolvedFilename = resolveFilename(file);
    const resolvedFolderPath = folderName ? `${folderName}/` : '';
    const resolvedPath = resolvedFolderPath + resolvedFilename;

    try {
      const fileUrl = await assetManager.uploadFile(resolvedPath, file);
      const cdnUrl = resolveCdnUrl(fileUrl);

      return cdnUrl;
    } catch (error) {
      // reusing image uploader localization
      throw new Error(i18next.t('image-uploader.upload-failed-message'));
    }
  }

  render() {
    const {
      elementId,
      field,
      name,
      helpText,
      className,
      ...otherProps
    } = this.props;
    const { value } = this.state;

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
          enableImageUpload
          onChange={this.handleChange}
          onImageUpload={this.handleImageUpload}
          value={value}
          {...otherProps}
        />
        {helpBlockText && <HelpBlock>{helpBlockText}</HelpBlock>}
      </FormGroup>
    );
  }
}

TextEditorReduxFormElement.propTypes = {
  assetManager: PropTypes.shape({
    deleteFile: PropTypes.func.isRequired,
    listFolder: PropTypes.func.isRequired,
    uploadFile: PropTypes.func.isRequired,
  }).isRequired,
  className: PropTypes.string,
  elementId: PropTypes.string,
  field: PropTypes.object,
  folderName: PropTypes.string,
  helpText: PropTypes.string,
  maxFileSize: PropTypes.number,
  name: PropTypes.string,
};

TextEditorReduxFormElement.defaultProps = {
  maxFileSize: 10000000,
};
