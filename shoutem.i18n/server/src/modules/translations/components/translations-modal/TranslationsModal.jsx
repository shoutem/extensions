import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import {
  Button,
  FormGroup,
  ControlLabel,
  ButtonToolbar,
  HelpBlock,
} from 'react-bootstrap';
import i18next from 'i18next';
import autoBindReact from 'auto-bind/react';
import { LoaderContainer, InlineModal } from '@shoutem/react-web-ui';
import { ext } from 'src/const';
import { FileUploader, LanguageSelect } from 'src/components';
import { validateJson, LANGUAGES } from 'src/services';
import LOCALIZATION from './localization';
import './style.scss';

export default class TranslationsModal extends Component {
  constructor(props) {
    super(props);
    autoBindReact(this);

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
      return this.props.onUpdate(newTranslation).then(this.handleHide);
    }

    return this.props.onCreate(newTranslation).then(this.handleHide);
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

    const languageCodeError =
      !languageCode && i18next.t(LOCALIZATION.ERROR_LANGUAGE_REQUIRED);
    const translationUrlError =
      !translationUrl && i18next.t(LOCALIZATION.ERROR_FILE_REQUIRED);

    this.setState({
      errors: {
        languageCode: languageCodeError,
        translationUrl: translationUrlError,
      },
    });

    return !(languageCodeError || translationUrlError);
  }

  resolveAvailableLanguageCodes() {
    const { usedLanguageCodes } = this.props;
    const { isUpdate } = this.state;

    if (isUpdate) {
      return [];
    }

    return _.chain(LANGUAGES)
      .mapValues((name, code) => code)
      .values()
      .filter(
        code =>
          _.isEmpty(usedLanguageCodes) || !_.includes(usedLanguageCodes, code),
      )
      .value();
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

    const modalTitle = isUpdate
      ? i18next.t(LOCALIZATION.UPDATE_TITLE)
      : i18next.t(LOCALIZATION.ADD_TITLE);
    const availableLanguageCodes = this.resolveAvailableLanguageCodes();

    return (
      <InlineModal
        className="settings-page-modal translations-modal"
        onHide={this.handleHide}
        show={show}
        title={modalTitle}
      >
        <form onSubmit={this.handleFormSubmit}>
          <FormGroup>
            <ControlLabel>
              {i18next.t(LOCALIZATION.LANGUAGE_FORM_TITLE)}
            </ControlLabel>
            <LanguageSelect
              onChange={this.handleLanguageChange}
              availableLanguageCodes={availableLanguageCodes}
              value={languageCode}
              disabled={isUpdate}
            />
            {showErrors && errors.languageCode && (
              <HelpBlock className="text-error">
                {errors.languageCode}
              </HelpBlock>
            )}
          </FormGroup>
          <FormGroup>
            <ControlLabel>
              {i18next.t(LOCALIZATION.UPLOAD_FORM_TITLE)}
            </ControlLabel>
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
              <HelpBlock className="text-error">
                {errors.translationUrl}
              </HelpBlock>
            )}
          </FormGroup>
        </form>
        <ButtonToolbar>
          <Button onClick={this.handleHide}>
            {i18next.t(LOCALIZATION.CANCEL_BTN_LABEL)}
          </Button>
          <Button
            bsStyle="primary"
            disabled={inProgress}
            onClick={this.handleSaveClick}
          >
            <LoaderContainer isLoading={inProgress}>
              {i18next.t(LOCALIZATION.SAVE_BTN_LABEL)}
            </LoaderContainer>
          </Button>
        </ButtonToolbar>
      </InlineModal>
    );
  }
}

TranslationsModal.propTypes = {
  usedLanguageCodes: PropTypes.array,
  assetManager: PropTypes.func,
  onUpdate: PropTypes.func,
  onCreate: PropTypes.func,
};
