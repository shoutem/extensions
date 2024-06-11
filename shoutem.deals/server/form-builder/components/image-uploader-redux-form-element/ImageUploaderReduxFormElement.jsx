import React, { PureComponent } from 'react';
import { ControlLabel, FormGroup, HelpBlock } from 'react-bootstrap';
import autoBindReact from 'auto-bind/react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { ImageUploader } from '@shoutem/file-upload';
import { fieldInError, resolveCdnUrl } from '../services';

function resolveFilename(file) {
  const timestamp = new Date().getTime();
  return `${timestamp}-${file.name}`;
}

export default class ImageUploaderReduxFormElement extends PureComponent {
  constructor(props) {
    super(props);

    autoBindReact(this);
  }

  handleImageDrop() {
    // do nothing
  }

  handleImageUploadSuccess(imageUrl) {
    const { field } = this.props;

    const cdnUrl = resolveCdnUrl(imageUrl);
    field.onChange(cdnUrl);
  }

  handleImageDeleteSuccess() {
    const { field } = this.props;
    field.onChange('');
  }

  handlePreviewClick(link) {
    if (link) {
      window.open(link, '_blank');
    }
  }

  render() {
    const {
      assetManager,
      elementId,
      field,
      name,
      helpText,
      className,
      folderName,
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
        <ImageUploader
          accept="image/*"
          assetManager={assetManager}
          className="translations-modal__uploader"
          folderName={folderName}
          onDeleteSuccess={this.handleImageDeleteSuccess}
          onDrop={this.handleImageDrop}
          onUploadSuccess={this.handleImageUploadSuccess}
          resolveFilename={resolveFilename}
          onPreviewClick={this.handlePreviewClick}
          shallowDelete
          src={field.value}
          {...otherProps}
        />
        {helpBlockText && <HelpBlock>{helpBlockText}</HelpBlock>}
      </FormGroup>
    );
  }
}

ImageUploaderReduxFormElement.propTypes = {
  assetManager: PropTypes.object.isRequired,
  elementId: PropTypes.string.isRequired,
  field: PropTypes.object.isRequired,
  folderName: PropTypes.string.isRequired,
  helpText: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  className: PropTypes.string,
};
