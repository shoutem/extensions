import React, { createRef } from 'react';
import { HelpBlock } from 'react-bootstrap';
import Dropzone from 'react-dropzone';
import autoBindReact from 'auto-bind/react';
import classNames from 'classnames';
import i18next from 'i18next';
import _ from 'lodash';
import PropTypes from 'prop-types';
import AudioPreview from '../audio-preview';
import AudioUploadPlaceholder from '../audio-upload-placeholder';
import LOCALIZATION from '../file-uploader/localization';
import { resolveCdnUrl } from '../services';
import './style.scss';

export default class AudioUploader extends React.Component {
  constructor(props) {
    super(props);
    autoBindReact(this);

    this.dropzoneRef = createRef();

    this.state = {
      inProgress: false,
      error: null,
    };
  }

  handleUploadFailed(errorMessage) {
    const { onError } = this.props;

    this.setState({
      error: errorMessage,
      inProgress: false,
    });

    if (_.isFunction(onError)) {
      onError(errorMessage);
    }
  }

  handleUploadSucceeded(fileUrl) {
    const { onUploadSuccess } = this.props;

    this.setState({ inProgress: false });

    if (_.isFunction(onUploadSuccess)) {
      const cdnUrl = resolveCdnUrl(fileUrl);
      onUploadSuccess(cdnUrl);
    }
  }

  validateFileSize(file) {
    const { maxFileSize } = this.props;

    if (file.size > maxFileSize) {
      return i18next.t(LOCALIZATION.FILE_MAX_SIZE_ERROR, {
        maxFileSize: maxFileSize / 1000000,
      });
    }
    return null;
  }

  uploadFile(file) {
    const { assetManager, folderName, resolveFilename } = this.props;

    const resolvedFilename = resolveFilename(file);
    const resolvedFolderPath = folderName ? `${folderName}/` : '';
    const resolvedPath = resolvedFolderPath + resolvedFilename;

    return new Promise((resolve, reject) => {
      return assetManager
        .uploadFile(resolvedPath, file)
        .then(path => resolve(path))
        .catch(() => reject(i18next.t(LOCALIZATION.FILE_UPLOAD_FAILED_ERROR)));
    });
  }

  upload(file) {
    const { customValidator } = this.props;

    return new Promise((resolve, reject) => {
      const fileSizeError = this.validateFileSize(file);
      if (fileSizeError) {
        return reject(fileSizeError);
      }

      if (customValidator) {
        return Promise.resolve()
          .then(() => customValidator(file))
          .then(() => this.uploadFile(file))
          .then(resolvedPath => this.handleUploadSucceeded(resolvedPath))
          .catch(e => this.handleUploadFailed(e.message));
      }

      return this.uploadFile(file)
        .then(resolvedPath => this.handleUploadSucceeded(resolvedPath))
        .catch(e => this.handleUploadFailed(e.message));
    });
  }

  async handleFilesSelected(files) {
    const file = _.head(files);
    if (!file) {
      return;
    }

    this.setState({
      inProgress: true,
      error: null,
    });

    await this.upload(file)
      .then(this.handleUploadSucceeded)
      .catch(this.handleUploadFailed);
  }

  handleDeleteFailed() {
    const error = i18next.t(LOCALIZATION.FILE_DELETE_FAILED_ERROR);
    this.setState({
      error,
      inProgress: false,
    });
  }

  handleOnDelete(event) {
    event.stopPropagation();

    const { src, shallowDelete, onDeleteSuccess, assetManager } = this.props;

    if (shallowDelete) {
      return onDeleteSuccess(src);
    }

    this.setState({ inProgress: true });

    return assetManager.deleteFile(src).then(() => {
      this.setState({ inProgress: false });
      return onDeleteSuccess(src);
    }, this.handleDeleteFailed);
  }

  handleOpenFilePicker() {
    this.dropzoneRef.current.open();
  }

  render() {
    const {
      className,
      showValidationError,
      maxFileSize,
      helpText,
      accept,
      src,
    } = this.props;
    const { inProgress, error } = this.state;

    const classes = classNames(className, 'audio-uploader');

    return (
      <div className={classes}>
        <Dropzone
          className="audio-uploader__dropzone"
          ref={this.dropzoneRef}
          onDrop={this.handleFilesSelected}
          maxSize={maxFileSize}
          multiple={false}
          accept={accept}
        />
        {!src && (
          <AudioUploadPlaceholder
            onClick={this.handleOpenFilePicker}
            isLoading={inProgress}
          />
        )}
        {!!src && <AudioPreview src={src} onDelete={this.handleOnDelete} />}
        {showValidationError && error && (
          <div className="text-error">{error}</div>
        )}
        {helpText && !error && <HelpBlock>{helpText}</HelpBlock>}
      </div>
    );
  }
}

AudioUploader.propTypes = {
  assetManager: PropTypes.shape({
    deleteFile: PropTypes.func.isRequired,
    listFolder: PropTypes.func.isRequired,
    uploadFile: PropTypes.func.isRequired,
  }).isRequired,
  folderName: PropTypes.string.isRequired,
  /**
   *  Callback invoked when file is uploaded
   */
  onUploadSuccess: PropTypes.func.isRequired,
  accept: PropTypes.string,
  /**
   * Additional classes to apply
   */
  className: PropTypes.string,
  /**
   * Provides a way to perform custom file validation before upload.
   * If you return a promise it will be resolved.
   */
  customValidator: PropTypes.func,
  /**
   * Help text positioned below dropzone
   */
  helpText: PropTypes.string,
  /**
   * Max file size allowed to be uploaded
   */
  maxFileSize: PropTypes.number,
  resolveFilename: PropTypes.func,
  /**
   * Max file size allowed to be uploaded
   */
  shallowDelete: PropTypes.bool,
  /**
   * Flag indicating whether to show validation error in component.
   * If set to false, onError function should be provided for displaying upload error.
   */
  showValidationError: PropTypes.bool,
  /**
   *  Url to the src
   */
  src: PropTypes.string,
  /**
   *  Callback forwarded to FilePreview component; invoked when existing file is deleted
   */
  onDeleteSuccess: PropTypes.func,
  /**
   *  Callback invoked when upload fails
   */
  onError: PropTypes.func,
};

AudioUploader.defaultProps = {
  maxFileSize: 10000000,
  onError: () => {},
  customValidator: _.noop,
  showValidationError: true,
  resolveFilename: file => file.name,
  accept: 'audio/*',
};
