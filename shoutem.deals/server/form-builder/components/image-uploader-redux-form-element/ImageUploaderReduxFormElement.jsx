import React, { PureComponent } from 'react';
import autoBindReact from 'auto-bind/react';
import PropTypes from 'prop-types';
import { HelpBlock, ControlLabel, FormGroup } from 'react-bootstrap';
import { ImageUploader } from '@shoutem/file-upload';
import classNames from 'classnames';
import { fieldInError } from '../services';

function resolveFilename(file) {
  const timestamp = new Date().getTime();

  return `${timestamp}-${file.name}`;
}

export default class ImageUploaderReduxFormElement extends PureComponent {
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

    autoBindReact(this);

    this.state = {
      inProgress: false,
    };
  }

  handleImageDrop() {
    this.setState({ inProgress: true });
  }

  handleImageUploadSuccess(imageUrl) {
    const { field } = this.props;

    this.setState({ inProgress: false });
    field.onChange(imageUrl);
  }

  handleImageDeleteSuccess() {
    const { field } = this.props;

    field.onChange('');
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
          shallowDelete
          src={field.value}
          {...otherProps}
        />
        {helpBlockText && <HelpBlock>{helpBlockText}</HelpBlock>}
      </FormGroup>
    );
  }
}
