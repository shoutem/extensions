import React, { PureComponent } from 'react';
import autoBindReact from 'auto-bind/react';
import classNames from 'classnames';
import i18next from 'i18next';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { HelpBlock } from 'react-bootstrap';
import Dropzone from 'react-dropzone';
import { LoaderContainer } from '@shoutem/react-web-ui';
import ImageUploadPlaceholder from '../image-upload-placeholder';
import ImagePreview from '../image-preview';
import LOCALIZATION from './localization';
import './style.scss';

export default class ImageUploader extends PureComponent {
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
    onError(errorMessage);
  }

  handleUploadSucceeded(fileUrl) {
    const { onUploadSuccess } = this.props;

    onUploadSuccess(fileUrl);
    this.setState({ inProgress: false });
  }

  validateFileSize(file) {
    const { maxFileSize } = this.props;

    if (file.size > maxFileSize) {
      return i18next.t(LOCALIZATION.MAX_SIZE_MESSAGE, {
        maxSize: maxFileSize / 1000000,
      });
    }

    return null;
  }

  upload(file) {
    const { assetManager, folderName, resolveFilename } = this.props;

    return new Promise((resolve, reject) => {
      const fileSizeError = this.validateFileSize(file);
      if (fileSizeError) {
        reject(fileSizeError);
        return;
      }

      const resolvedFilename = resolveFilename(file);
      const resolvedFolderPath = folderName ? `${folderName}/` : '';
      const resolvedPath = resolvedFolderPath + resolvedFilename;

      assetManager
        .uploadFile(resolvedPath, file)
        .then(resolve, () =>
          reject(i18next.t(LOCALIZATION.UPLOAD_FAILED_MESSAGE)),
        );
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

    this.upload(files[0]).then(
      this.handleUploadSucceeded,
      this.handleUploadFailed,
    );
  }

  handleDropRejected() {
    this.setState({ error: i18next.t(LOCALIZATION.FILE_REJECTED_MESSAGE) });
  }

  handleDeleteFailed() {
    this.setState({
      error: i18next.t(LOCALIZATION.DELETE_FAILED_MESSAGE),
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
      return <ImageUploadPlaceholder />;
    }

    return (
      <ImagePreview
        canBeDeleted={canBeDeleted}
        onDeleteClick={this.handleDeleteClick}
        src={src}
      />
    );
  }

  render() {
    const {
      className,
      showValidationError,
      helpText,
      accept,
      disabled,
    } = this.props;
    const { error, inProgress } = this.state;

    const classes = classNames(className, 'image-uploader');

    return (
      <LoaderContainer className={classes} isLoading={inProgress}>
        <Dropzone
          accept={accept}
          className="image-uploader__dropzone"
          disabled={disabled}
          multiple={false}
          onDrop={this.handleDrop}
          onDropRejected={this.handleDropRejected}
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

ImageUploader.propTypes = {
  /**
   *  Callback invoked when file is dropped and upload starts
   */
  onDrop: PropTypes.func.isRequired,
  /**
   *  Callback invoked when file is uploaded
   */
  onUploadSuccess: PropTypes.func.isRequired,
  /**
   *  Callback invoked when upload fails
   */
  onError: PropTypes.func,
  /**
   * Additional classes to apply
   */
  className: PropTypes.string,
  /**
   *  Url to the src
   */
  src: PropTypes.string,
  /**
   * Flag indicating whether to show validation error in component.
   * If set to false, onError function should be provided for displaying upload error.
   */
  showValidationError: PropTypes.bool,
  /**
   * Help text positioned below dropzone
   */
  helpText: PropTypes.string,
  /**
   * Object containing methods for inProgress, listing, and deleting files on cloud
   */
  assetManager: PropTypes.shape({
    deleteFile: PropTypes.func.isRequired,
    uploadFile: PropTypes.func.isRequired,
    listFolder: PropTypes.func.isRequired,
  }),
  folderName: PropTypes.string,
  resolveFilename: PropTypes.func,
  /**
   *  Callback forwarded to ImagePreview component; invoked when existing file is deleted
   */
  onDeleteSuccess: PropTypes.func,
  /**
   * Flag indicating whether file can be deleted
   */
  canBeDeleted: PropTypes.bool,
  /**
   * By providing accept prop you can make Dropzone to accept
   * specific file types and reject the others.
   */
  accept: PropTypes.string,
  /**
   * Max file size allowed to be uploaded
   */
  maxFileSize: PropTypes.number,
  /**
   * Max file size allowed to be uploaded
   */
  shallowDelete: PropTypes.bool,
  /**
   * Flag indicating whether upload is disabled
   */
  disabled: PropTypes.bool,
};

ImageUploader.defaultProps = {
  maxFileSize: 10000000,
  onError: () => {},
  showValidationError: true,
  canBeDeleted: true,
  autoResize: true,
  resolveFilename: file => file.name,
};
