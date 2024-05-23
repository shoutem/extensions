import React, { Component } from 'react';
import { ControlLabel, FormGroup, HelpBlock } from 'react-bootstrap';
import autoBindReact from 'auto-bind/react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { AudioUploader } from '@shoutem/file-upload';
import { fieldInError } from '../services';

function resolveFilename(file) {
  const timestamp = new Date().getTime();
  const fileName = file.name ? `${timestamp}-${file.name}` : `${timestamp}`;

  return fileName;
}

export default class AudioUploaderReduxFormElement extends Component {
  constructor(props) {
    super(props);
    autoBindReact(this);
  }

  async handleUploadSuccess(url) {
    const { field } = this.props;

    const value = { url };
    field.onChange(value);
  }

  handleOnDeleteSuccess() {
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
    const url = _.get(field, 'value.url');

    return (
      <FormGroup
        className={className}
        controlId={elementId}
        validationState={isError ? 'error' : 'success'}
      >
        {name && <ControlLabel>{name}</ControlLabel>}
        <AudioUploader
          accept="audio/*"
          assetManager={assetManager}
          folderName={folderName}
          onDeleteSuccess={this.handleOnDeleteSuccess}
          onUploadSuccess={this.handleUploadSuccess}
          resolveFilename={resolveFilename}
          shallowDelete
          src={url}
          {...otherProps}
        />
        {helpBlockText && <HelpBlock>{helpBlockText}</HelpBlock>}
      </FormGroup>
    );
  }
}

AudioUploaderReduxFormElement.propTypes = {
  assetManager: PropTypes.object.isRequired,
  elementId: PropTypes.string.isRequired,
  field: PropTypes.object.isRequired,
  folderName: PropTypes.string.isRequired,
  className: PropTypes.string,
  helpText: PropTypes.string,
  name: PropTypes.string,
};
