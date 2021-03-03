import React, { Component } from 'react';
import PropTypes from 'prop-types';
import autoBindReact from 'auto-bind/react';
import {
  Modal,
  Button,
  FormGroup,
  ControlLabel,
  HelpBlock,
} from 'react-bootstrap';
import _ from 'lodash';
import i18next from 'i18next';
import { LoaderContainer } from '@shoutem/react-web-ui';
import { FileUploader } from '../../file-upload';
import { IMPORTER_SCHEDULE_SETTINGS } from '../../const';
import ImporterLanguageSelector from '../importer-language-selector';
import LOCALIZATION from './localization';

const FILE_UPLOAD_STYLE = {
  height: 100,
};

export default class ImporterCsvForm extends Component {
  constructor(props) {
    super(props);
    autoBindReact(this);

    this.state = {
      fileUrl: null,
      fileName: null,
      schedule: IMPORTER_SCHEDULE_SETTINGS.ONCE,
      languageIds: [],
      inProgress: false,
      errors: {},
      showErrors: false,
    };
  }

  async handleNextClick() {
    const { loadCsvColumns } = this.props;
    const { fileUrl, fileName, languageIds, schedule } = this.state;
    let csvColumns = [];

    this.setState({ showErrors: true, inProgress: true });

    if (_.isFunction(loadCsvColumns)) {
      try {
        csvColumns = await loadCsvColumns(fileUrl);
      } catch (error) {
        // do nothing
      }
    }

    const values = {
      fileUrl,
      fileName,
      languageIds,
      schedule,
      csvColumns,
    };

    await this.props.onSubmit(values);
  }

  handleFileDrop() {
    this.setState({ inProgress: true });
  }

  handleFileUploadSuccess(fileUrl) {
    this.setState({ fileUrl, inProgress: false });
  }

  handleFileDeleteSuccess() {
    this.setState({ fileUrl: null });
  }

  handleUploadError() {
    this.setState({
      inProgress: false,
      showErrors: true,
    });
  }

  handleLanguagesChanged(selectedLanguages) {
    this.setState({ languageIds: selectedLanguages });
  }

  handleResolveFileName(file) {
    this.setState({ fileName: file.name });

    const timestamp = new Date().getTime();
    return `${timestamp}-${file.name}`;
  }

  render() {
    const { assetManager, languages, abortTitle, confirmTitle } = this.props;
    const { fileUrl, languageIds, errors, showErrors, inProgress } = this.state;

    const hasLanguages = !_.isEmpty(languages);

    // using heigth 100 !!! as class is not working
    return (
      <React.Fragment>
        <Modal.Body>
          <FormGroup>
            <ControlLabel>
              {i18next.t(LOCALIZATION.FORM_FILE_TITLE)}
            </ControlLabel>
            <div style={FILE_UPLOAD_STYLE}>
              <FileUploader
                src={fileUrl}
                assetManager={assetManager}
                folderName="importers/csv"
                accept=".csv"
                shallowDelete
                onDrop={this.handleFileDrop}
                onUploadSuccess={this.handleFileUploadSuccess}
                onDeleteSuccess={this.handleFileDeleteSuccess}
                onError={this.handleUploadError}
                resolveFilename={this.handleResolveFileName}
              />
            </div>
            {showErrors && errors.fileUrl && (
              <HelpBlock className="text-error">{errors.fileUrl}</HelpBlock>
            )}
          </FormGroup>
          {hasLanguages && (
            <ImporterLanguageSelector
              languages={languages}
              onSelectionChanged={this.handleLanguagesChanged}
              selectedLanguages={languageIds}
            />
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={this.props.onClose}>{abortTitle}</Button>
          <Button
            bsStyle="primary"
            onClick={this.handleNextClick}
            disabled={inProgress || !fileUrl}
          >
            <LoaderContainer isLoading={inProgress}>
              {confirmTitle}
            </LoaderContainer>
          </Button>
        </Modal.Footer>
      </React.Fragment>
    );
  }
}

ImporterCsvForm.propTypes = {
  assetManager: PropTypes.object,
  languages: PropTypes.array,
  abortTitle: PropTypes.string,
  confirmTitle: PropTypes.string,
  onSubmit: PropTypes.func,
  onClose: PropTypes.func,
  loadCsvColumns: PropTypes.func,
  createImporter: PropTypes.func,
};
