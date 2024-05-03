import React from 'react';
import { HelpBlock } from 'react-bootstrap';
import Dropzone from 'react-dropzone';
import autoBindReact from 'auto-bind/react';
import classNames from 'classnames';
import i18next from 'i18next';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { LoaderContainer } from '@shoutem/react-web-ui';
import FilePreview from '../file-preview';
import FileUploadPlaceholder from '../file-upload-placeholder';
import { resolveCdnUrl } from '../services';
import LOCALIZATION from './localization';
import './style.scss';

export default class FileUploader extends React.Component {
  constructor(props) {
    super(props);
    autoBindReact(this);

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
    const { onUploadSuccess, useCdn } = this.props;

    this.setState({ inProgress: false });

    if (_.isFunction(onUploadSuccess)) {
      if (useCdn) {
        const cdnUrl = resolveCdnUrl(fileUrl);
        onUploadSuccess(cdnUrl);
        return;
      }

      onUploadSuccess(fileUrl);
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

  handleDrop(files) {
    const { onDrop } = this.props;

    const file = _.get(files, [0]);

    if (!file) {
      return;
    }

    this.setState({
      inProgress: true,
      error: null,
    });

    onDrop();

    this.upload(files[0])
      .then(this.handleUploadSucceeded)
      .catch(this.handleUploadFailed);
  }

  handleDropRejected() {
    this.setState({ error: i18next.t(LOCALIZATION.FILE_REJECTED_ERROR) });
  }

  handleDeleteFailed() {
    const error = i18next.t(LOCALIZATION.FILE_DELETE_FAILED_ERROR);
    this.setState({
      error,
      inProgress: false,
    });
  }

  handleDeleteClick(event) {
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

  renderDropzoneContent() {
    const { src, canBeDeleted } = this.props;

    if (!src) {
      return <FileUploadPlaceholder />;
    }

    return (
      <FilePreview
        src={src}
        canBeDeleted={canBeDeleted}
        onDeleteClick={this.handleDeleteClick}
      />
    );
  }

  render() {
    const { className, showValidationError, helpText, accept } = this.props;
    const { inProgress, error } = this.state;

    const classes = classNames(className, 'file-uploader');

    return (
      <LoaderContainer isLoading={inProgress} className={classes}>
        <Dropzone
          className="file-uploader__dropzone"
          onDrop={this.handleDrop}
          onDropRejected={this.handleDropRejected}
          multiple={false}
          accept={accept}
        >
          {dropzoneProps => this.renderDropzoneContent(dropzoneProps)}
        </Dropzone>
        {showValidationError && error && (
          <div className="text-error">{error}</div>
        )}
        {helpText && !error && <HelpBlock>{helpText}</HelpBlock>}
      </LoaderContainer>
    );
  }
}

FileUploader.propTypes = {
  /**
   *  Callback invoked when file is dropped and upload starts
   */
  onDrop: PropTypes.func.isRequired,
  /**
   *  Callback invoked when file is uploaded
   */
  onUploadSuccess: PropTypes.func.isRequired,
  /**
   * By providing accept prop you can make Dropzone to accept
   * specific file types and reject the others.
   */
  accept: PropTypes.string,
  assetManager: PropTypes.shape({
    deleteFile: PropTypes.func.isRequired,
    listFolder: PropTypes.func.isRequired,
    uploadFile: PropTypes.func.isRequired,
  }),
  /**
   * Flag indicating whether file can be deleted
   */
  canBeDeleted: PropTypes.bool,
  /**
   * Additional classes to apply
   */
  className: PropTypes.string,
  /**
   * Provides a way to perform custom file validation before upload.
   * If you return a promise it will be resolved.
   */
  customValidator: PropTypes.func,
  folderName: PropTypes.string,
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
   * Flag indicating whether to use CDN url or bucket url
   */
  useCdn: PropTypes.bool,
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

FileUploader.defaultProps = {
  maxFileSize: 10000000,
  onError: () => {},
  customValidator: _.noop,
  showValidationError: true,
  canBeDeleted: true,
  useCdn: true,
  resolveFilename: file => file.name,
};
