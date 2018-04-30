import React from 'react';
import _ from 'lodash';
import { HelpBlock } from 'react-bootstrap';
import { LoaderContainer } from '@shoutem/react-web-ui';
import Dropzone from 'react-dropzone';
import classNames from 'classnames';
import FilePreview from '../file-preview';
import FileUploadPlaceholder from '../file-upload-placeholder';
import './style.scss';

export default class FileUploader extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      inProgress: false,
      error: null,
    };

    this.handleUploadFailed = this.handleUploadFailed.bind(this);
    this.handleUploadSucceeded = this.handleUploadSucceeded.bind(this);
    this.handleDeleteClick = this.handleDeleteClick.bind(this);
    this.handleDeleteFailed = this.handleDeleteFailed.bind(this);
    this.validateFileSize = this.validateFileSize.bind(this);
    this.uploadFile = this.uploadFile.bind(this);
    this.upload = this.upload.bind(this);
    this.handleDrop = this.handleDrop.bind(this);
    this.handleDropRejected = this.handleDropRejected.bind(this);
    this.renderDropzoneContent = this.renderDropzoneContent.bind(this);
  }

  handleUploadFailed(errorMessage) {
    this.setState({
      error: errorMessage,
      inProgress: false,
    });
    this.props.onError(errorMessage);
  }

  handleUploadSucceeded(fileUrl) {
    this.props.onUploadSuccess(fileUrl);
    this.setState({ inProgress: false });
  }

  validateFileSize(file) {
    const { maxFileSize } = this.props;
    if (file.size > maxFileSize) {
      return `Max allowed file size is ${maxFileSize / 1000000}MB!`;
    }
    return null;
  }

  uploadFile(file) {
    const { assetManager, folderName, resolveFilename } = this.props;

    return new Promise((resolve, reject) => {
      const fileSizeError = this.validateFileSize(file);

      const resolvedFilename = resolveFilename(file);
      const resolvedFolderPath = folderName ? `${folderName}/` : '';
      const resolvedPath = resolvedFolderPath + resolvedFilename;

      return assetManager.uploadFile(resolvedPath, file)
        .then((path) => resolve(path))
        .catch(() => reject('File upload failed.'));
    });
  }

  upload(file) {
    const { customValidator } = this.props;

    return new Promise((resolve, reject) => {
      const fileSizeError = this.validateFileSize(file);
      if (fileSizeError) {
        reject(fileSizeError);
        return;
      }

      if (customValidator) {
        return Promise.resolve()
          .then(() => customValidator(file))
          .then(() => this.uploadFile(file))
          .then((resolvedPath) => this.handleUploadSucceeded(resolvedPath))
          .catch((e) => this.handleUploadFailed(e.message));
      }

      return this.uploadFile(file)
        .then((resolvedPath) => this.handleUploadSucceeded(resolvedPath))
        .catch((e) => this.handleUploadFailed(e.message));
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
    this.setState({ error: 'File rejected.' });
  }

  handleDeleteFailed() {
    const error = 'Delete failed.';
    this.setState({
      error,
      inProgress: false,
    });
  }

  handleDeleteClick(event) {
    event.stopPropagation();

    const {
      src,
      shallowDelete,
      onDeleteSuccess,
      assetManager,
    } = this.props;

    if (shallowDelete) {
      return onDeleteSuccess(src);
    }

    this.setState({ inProgress: true });
    return assetManager.deleteFile(src)
      .then(() => {
        this.setState({ inProgress: false });
        return onDeleteSuccess(src);
      }, this.handleDeleteFailed);
  }

  renderDropzoneContent() {
    const {
      src,
      canBeDeleted,
    } = this.props;

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
    const {
      className,
      showValidationError,
      helpText,
      accept,
    } = this.props;

    const classes = classNames(
      className,
      'file-uploader',
    );

    return (
      <LoaderContainer
        isLoading={this.state.inProgress}
        className={classes}
      >
        <Dropzone
          className="file-uploader__dropzone"
          onDrop={this.handleDrop}
          onDropRejected={this.handleDropRejected}
          multiple={false}
          accept={accept}
        >
          { dropzoneProps => this.renderDropzoneContent(dropzoneProps) }
        </Dropzone>
        {showValidationError && this.state.error &&
          <div className="text-error">{this.state.error}</div>
        }
        {helpText && !this.state.error &&
          <HelpBlock>{helpText}</HelpBlock>
        }
      </LoaderContainer>
    );
  }
}

FileUploader.propTypes = {
  /**
   *  Callback invoked when file is dropped and upload starts
   */
  onDrop: React.PropTypes.func.isRequired,
  /**
   *  Callback invoked when file is uploaded
   */
  onUploadSuccess: React.PropTypes.func.isRequired,
  /**
   *  Callback invoked when upload fails
   */
  onError: React.PropTypes.func,
  /**
   * Additional classes to apply
   */
  className: React.PropTypes.string,
  /**
   *  Url to the src
   */
  src: React.PropTypes.string,
  /**
   * Flag indicating whether to show validation error in component.
   * If set to false, onError function should be provided for displaying upload error.
   */
  showValidationError: React.PropTypes.bool,
  /**
   * Help text positioned below dropzone
   */
  helpText: React.PropTypes.string,
  /**
   * Object containing methods for inProgress, listing, and deleting files on cloud
   */
  assetManager: React.PropTypes.shape({
    deleteFile: React.PropTypes.func.isRequired,
    uploadFile: React.PropTypes.func.isRequired,
    listFolder: React.PropTypes.func.isRequired,
  }),
  folderName: React.PropTypes.string,
  resolveFilename: React.PropTypes.func,
  /**
   *  Callback forwarded to FilePreview component; invoked when existing file is deleted
   */
  onDeleteSuccess: React.PropTypes.func,
  /**
   * Flag indicating whether file can be deleted
   */
  canBeDeleted: React.PropTypes.bool,
  /**
   * By providing accept prop you can make Dropzone to accept
   * specific file types and reject the others.
   */
  accept: React.PropTypes.string,
  /**
   * Max file size allowed to be uploaded
   */
  maxFileSize: React.PropTypes.number,
  /**
   * Max file size allowed to be uploaded
   */
  shallowDelete: React.PropTypes.bool,
  /**
   * Provides a way to perform custom file validation before upload.
   * If you return a promise it will be resolved.
   */
  customValidator: React.PropTypes.func,
};

FileUploader.defaultProps = {
  maxFileSize: 10000000,
  onError: () => {},
  customValidator: _.noop,
  showValidationError: true,
  canBeDeleted: true,
  autoResize: true,
  resolveFilename: file => file.name,
};
