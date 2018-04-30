import React, { Component, PropTypes } from 'react';
import { Button, FormGroup, ControlLabel, ButtonToolbar, HelpBlock } from 'react-bootstrap';
import { LoaderContainer, InlineModal } from '@shoutem/react-web-ui';
import { ext } from 'src/const';
import { FileUploader, LanguageSelect } from 'src/components';
import { validateJson } from '../../services';
import './style.scss';

export default class TranslationsModal extends Component {
  constructor(props) {
    super(props);

    this.show = this.show.bind(this);
    this.handleHide = this.handleHide.bind(this);
    this.handleSaveClick = this.handleSaveClick.bind(this);
    this.handleFormSubmit = this.handleFormSubmit.bind(this);
    this.handleLanguageChange = this.handleLanguageChange.bind(this);
    this.handleTranslationDrop = this.handleTranslationDrop.bind(this);
    this.handleTranslationUploadSuccess = this.handleTranslationUploadSuccess.bind(this);
    this.handleTranslationDeleteSuccess = this.handleTranslationDeleteSuccess.bind(this);
    this.handleUploadError = this.handleUploadError.bind(this);
    this.resolveTranslationFilename = this.resolveTranslationFilename.bind(this);
    this.validateForm = this.validateForm.bind(this);

    this.state = {
      inProgress: false,
      errors: {},
      showErrors: false,
      show: false,
      isUpdate: false,
      languageCode: null,
      translationUrl: null,
    };
  }

  show(translation) {
    this.setState({
      show: true,
    });

    if (translation) {
      const { code, url } = translation;
      this.setState({
        languageCode: code,
        translationUrl: url,
        isUpdate: true,
      });
    }
  }

  handleHide() {
    this.setState({
      inProgress: false,
      errors: {},
      showErrors: false,
      show: false,
      isUpdate: false,
      languageCode: null,
      translationUrl: null,
    });
  }

  handleSaveClick() {
    const { languageCode, translationUrl, isUpdate } = this.state;
    const newTranslation = { languageCode, translationUrl };

    this.setState({ showErrors: true });

    const isValid = this.validateForm();
    if (!isValid) {
      return null;
    }

    this.setState({ inProgress: true });
    if (isUpdate) {
      return this.props.onUpdate(newTranslation)
        .then(this.handleHide);
    }

    return this.props.onCreate(newTranslation)
      .then(this.handleHide);
  }

  handleFormSubmit(e) {
    e.preventDefault();
    this.handleSaveClick();
  }

  handleLanguageChange(languageOption) {
    const { value: languageCode } = languageOption;
    this.setState({ languageCode }, this.validateForm);
  }

  handleTranslationDrop() {
    this.setState({ inProgress: true });
  }

  handleTranslationUploadSuccess(translationUrl) {
    this.setState({ translationUrl, inProgress: false }, this.validateForm);
  }

  handleTranslationDeleteSuccess() {
    this.setState({ translationUrl: null });
  }

  resolveTranslationFilename(translationFile) {
    const timestamp = new Date().getTime();
    return `${timestamp}-${translationFile.name}`;
  }

  handleUploadError() {
    this.setState({
      inProgress: false,
      showErrors: true,
    });
  }

  validateForm() {
    const { languageCode, translationUrl } = this.state;

    const languageCodeError = !languageCode ? 'Translation language is required.' : null;
    const translationUrlError = !translationUrl ? 'Translation file is required.' : null;

    this.setState({
      errors: {
        languageCode: languageCodeError,
        translationUrl: translationUrlError,
      },
    });

    return !(languageCodeError || translationUrlError);
  }

  render() {
    const { assetManager } = this.props;
    const {
      show,
      isUpdate,
      languageCode,
      translationUrl,
      errors,
      showErrors,
      inProgress,
    } = this.state;

    const modalTitle = isUpdate ? 'Update translation' : 'Add translation';

    return (
      <InlineModal
        className="settings-page-modal translations-modal"
        onHide={this.handleHide}
        show={show}
        title={modalTitle}
      >
        <form onSubmit={this.handleFormSubmit}>
          <FormGroup>
            <ControlLabel>Select language</ControlLabel>
            <LanguageSelect
              onChange={this.handleLanguageChange}
              value={languageCode}
              disabled={isUpdate}
            />
            {showErrors && errors.languageCode && (
              <HelpBlock className="text-error">{errors.languageCode}</HelpBlock>
            )}
          </FormGroup>
          <FormGroup>
            <ControlLabel>Translation file (.json)</ControlLabel>
            <FileUploader
              className="translations-modal__uploader"
              src={translationUrl}
              assetManager={assetManager}
              folderName={ext()}
              accept=".json"
              shallowDelete
              onDrop={this.handleTranslationDrop}
              onUploadSuccess={this.handleTranslationUploadSuccess}
              onDeleteSuccess={this.handleTranslationDeleteSuccess}
              onError={this.handleUploadError}
              resolveFilename={this.resolveTranslationFilename}
              customValidator={validateJson}
            />
            {showErrors && errors.translationUrl && (
              <HelpBlock className="text-error">{errors.translationUrl}</HelpBlock>
            )}
          </FormGroup>
        </form>
        <ButtonToolbar>
          <Button onClick={this.handleHide}>Cancel</Button>
          <Button
            bsStyle="primary"
            disabled={inProgress}
            onClick={this.handleSaveClick}
          >
            <LoaderContainer isLoading={inProgress}>
              Save
            </LoaderContainer>
          </Button>
        </ButtonToolbar>
      </InlineModal>
    );
  }
}

TranslationsModal.propTypes = {
  assetManager: PropTypes.func,
  onUpdate: PropTypes.func,
  onCreate: PropTypes.func,
};
