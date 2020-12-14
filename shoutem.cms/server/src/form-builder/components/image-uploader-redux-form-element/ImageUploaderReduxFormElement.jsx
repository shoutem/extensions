import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { HelpBlock, ControlLabel, FormGroup } from 'react-bootstrap';
import { ImageUploader } from '@shoutem/file-upload';
import { fieldInError } from '../services';

function resolveFilename(file) {
  const timestamp = new Date().getTime();
  const fileName = file.name ? `${timestamp}-${file.name}` : `${timestamp}`;

  return fileName;
}

export default class ImageUploaderReduxFormElement extends Component {
  static propTypes = {
    elementId: PropTypes.string,
    assetManager: PropTypes.object,
    name: PropTypes.string,
    field: PropTypes.object,
    helpText: PropTypes.string,
    className: PropTypes.string,
    folderName: PropTypes.string,
  };

  constructor(props) {
    super(props);

    this.handleImageDrop = this.handleImageDrop.bind(this);
    this.handleImageUploadSuccess = this.handleImageUploadSuccess.bind(this);
    this.handleImageDeleteSuccess = this.handleImageDeleteSuccess.bind(this);

    this.state = {
      inProgress: false,
    };
  }

  handleImageDrop() {
    this.setState({ inProgress: true });
  }

  async handleImageUploadSuccess(imageUrl) {
    const { field } = this.props;

    const value = { url: imageUrl };
    field.onChange(value);

    this.setState({ inProgress: false });
  }

  handleImageDeleteSuccess() {
    const { field } = this.props;
    field.onChange(null);
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

    const isError = fieldInError(field);
    const helpBlockText = isError ? field.error : helpText;
    const imageUrl = _.get(field, 'value.url');

    return (
      <FormGroup
        className={className}
        controlId={elementId}
        validationState={isError ? 'error' : 'success'}
      >
        <ControlLabel>{name}</ControlLabel>
        <ImageUploader
          accept="image/*"
          assetManager={assetManager}
          folderName={folderName}
          onDeleteSuccess={this.handleImageDeleteSuccess}
          onDrop={this.handleImageDrop}
          onUploadSuccess={this.handleImageUploadSuccess}
          resolveFilename={resolveFilename}
          shallowDelete
          src={imageUrl}
          {...otherProps}
        />
        {helpBlockText && <HelpBlock>{helpBlockText}</HelpBlock>}
      </FormGroup>
    );
  }
}
