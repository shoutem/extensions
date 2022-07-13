import React, { createRef, PureComponent } from 'react';
import { Alert, ControlLabel, FormGroup } from 'react-bootstrap';
import Dropzone from 'react-dropzone';
import autoBindReact from 'auto-bind/react';
import i18next from 'i18next';
import _ from 'lodash';
import PropTypes from 'prop-types';
import ext from 'src/const';
import { AssetManager } from '@shoutem/assets-sdk';
import { LoaderContainer } from '@shoutem/react-web-ui';
import { ChimeFilePreview, ChimeUploadInput } from '../../components';
import LOCALIZATION from './localization';
import './style.scss';

const ACCEPT = 'audio/mpeg';
const maxFileSize = 500000;
const folderName = ext();

function validateFileName(fileName) {
  // Must start with letter and may contain only characters, digits & underscores
  const fileNameRegex = /^[a-z][a-z0-9_]*$/;
  return fileNameRegex.test(fileName);
}

function resolveChimeFileName(chimeFile) {
  const timestamp = new Date().getTime();
  const name = _.head(chimeFile.name.split('.'));
  const type = _.last(chimeFile.name.split('.'));

  return `${name.toLowerCase()}_${timestamp}.${type}`;
}

export default class ChimeUploader extends PureComponent {
  constructor(props) {
    super(props);
    autoBindReact(this);

    const { appId, appsUrl } = props;

    this.assetManager = new AssetManager({
      scopeType: 'application',
      scopeId: appId,
      assetPolicyHost: appsUrl,
    });
    this.dropzoneRef = createRef();

    this.state = {
      inProgress: false,
      error: null,
    };
  }

  componentWillUnmount() {
    this.dropzoneRef = null;
  }

  handleFilesSelected(files) {
    const file = _.head(files);

    if (!file) {
      return;
    }

    const fileNameParts = file.name.split('.');
    const fileName = _.head(fileNameParts);
    const isValidFileName = validateFileName(fileName.toLowerCase());

    if (!isValidFileName || fileNameParts.length > 2) {
      this.setState({
        error: i18next.t(LOCALIZATION.ERROR_INVALID_FILE_NAME),
      });
      return;
    }

    this.setState({
      inProgress: true,
      error: null,
    });

    this.upload(file)
      .then(chime => this.handleUploadSucceeded(chime.fileUrl, chime.fileName))
      .catch(this.handleUploadFailed);
  }

  upload(file) {
    return new Promise((resolve, reject) => {
      const fileSizeError = this.validateFileSize(file);

      if (fileSizeError) {
        return reject(fileSizeError);
      }

      return this.uploadFile(file)
        .then(chime => {
          resolve(chime);
        })
        .catch(e => this.handleUploadFailed(e.message));
    });
  }

  validateFileSize(file) {
    if (file.size > maxFileSize) {
      const size = maxFileSize / 1000000;
      return i18next.t(LOCALIZATION.ERROR_MAX_SIZE, { size });
    }

    return null;
  }

  uploadFile(file) {
    return new Promise((resolve, reject) => {
      const fileName = resolveChimeFileName(file);
      const resolvedPath = `${folderName}/chime/${fileName}`;

      return this.assetManager
        .uploadFile(resolvedPath, file)
        .then(fileUrl => {
          const chime = { fileUrl, fileName };
          resolve(chime);
        })
        .catch(() => reject(i18next.t(LOCALIZATION.ERROR_UPLOAD_FAIL)));
    });
  }

  handleUploadSucceeded(fileUrl, fileName) {
    const { onUploadSuccess } = this.props;

    this.setState({ inProgress: false });
    onUploadSuccess({ fileName, fileUrl }, true);
  }

  handleUploadFailed(errorMessage) {
    this.setState({
      error: errorMessage,
      inProgress: false,
    });
  }

  handleDelete() {
    const { onDelete } = this.props;

    this.setState({ error: null });
    onDelete(true);
  }

  handleOpenFilePicker() {
    this.dropzoneRef.current.open();
  }

  render() {
    const { chime } = this.props;
    const { error, inProgress } = this.state;

    return (
      <>
        <h3>{i18next.t(LOCALIZATION.SETTINGS_TITLE)}</h3>
        <Alert className="publish-alert">
          {i18next.t(LOCALIZATION.CHIME_ALERT)}
        </Alert>
        <FormGroup>
          <ControlLabel>{i18next.t(LOCALIZATION.SOUND_LABEL)}</ControlLabel>
          <LoaderContainer isLoading={inProgress}>
            <Dropzone
              accept={ACCEPT}
              className="file-uploader__dropzone"
              maxSize={maxFileSize}
              onDrop={this.handleFilesSelected}
              ref={this.dropzoneRef}
            />
            {!chime.fileName && (
              <ChimeUploadInput onClick={this.handleOpenFilePicker} />
            )}
            {!!chime.fileName && (
              <ChimeFilePreview
                onDelete={this.handleDelete}
                soundName={chime.fileName}
                url={chime.fileUrl}
              />
            )}
            {error && <div className="text-error">{error}</div>}
          </LoaderContainer>
        </FormGroup>
      </>
    );
  }
}

ChimeUploader.propTypes = {
  appsUrl: PropTypes.string,
  appId: PropTypes.string,
  chime: PropTypes.object,
  onDelete: PropTypes.func,
  onUploadSuccess: PropTypes.func,
};
