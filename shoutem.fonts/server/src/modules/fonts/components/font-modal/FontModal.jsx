import React, { Component } from 'react';
import {
  Button,
  ButtonToolbar,
  ControlLabel,
  FormGroup,
  HelpBlock,
} from 'react-bootstrap';
import autoBindReact from 'auto-bind/react';
import i18next from 'i18next';
import _ from 'lodash';
import path from 'path';
import PropTypes from 'prop-types';
import { FileUploader, FontIcon, LoaderContainer } from '@shoutem/react-web-ui';
import LOCALIZATION from './localization';
import './style.scss';

function getAllFontsNames(fonts, font) {
  const names = _.map(fonts, 'name');
  const currentName = _.get(font, 'name');

  return _.remove(names, name => name !== currentName);
}

function resolveFileRequiredError(fileUrl) {
  const reqMsg = i18next.t(LOCALIZATION.FILE_URL_REQUIRED_ERROR);
  return _.isEmpty(fileUrl) ? reqMsg : null;
}

function validateName(font, allNames) {
  const errors = {};

  if (_.includes(allNames, font.name)) {
    errors.name = i18next.t(LOCALIZATION.NAME_TAKEN_ERROR);
  }

  if (_.isEmpty(font.name)) {
    errors.name = i18next.t(LOCALIZATION.NAME_REQUIRED_ERROR);
  }

  return errors;
}

function validate(font, allNames) {
  const errors = {};

  if (_.includes(allNames, font.name)) {
    errors.name = i18next.t(LOCALIZATION.NAME_TAKEN_ERROR);
  }

  if (_.isEmpty(font.name)) {
    errors.name = i18next.t(LOCALIZATION.NAME_REQUIRED_ERROR);
  }

  const fileUrlError = resolveFileRequiredError(font.fileUrl);
  if (fileUrlError) {
    errors.fileUrl = fileUrlError;
  }

  const boldFileUrlError = resolveFileRequiredError(font.boldFileUrl);
  if (boldFileUrlError) {
    errors.boldFileUrl = boldFileUrlError;
  }

  const italicFileUrlError = resolveFileRequiredError(font.italicFileUrl);
  if (italicFileUrlError) {
    errors.italicFileUrl = italicFileUrlError;
  }

  const boldItalicFileUrlError = resolveFileRequiredError(
    font.boldItalicFileUrl,
  );
  if (boldItalicFileUrlError) {
    errors.boldItalicFileUrl = boldItalicFileUrlError;
  }

  return errors;
}

export default class FontModal extends Component {
  constructor(props) {
    super(props);
    autoBindReact(this);

    const { font, fonts } = props;
    const clonedFont = _.cloneDeep(font) || {};

    const allNames = getAllFontsNames(fonts, font);
    const editMode = !!font;

    this.state = {
      editMode,
      font: clonedFont,
      allNames,
      inProgress: false,
      showErrors: false,
      nextStep: editMode,
      errors: {},
    };
  }

  handleSubmit() {
    const { onAddClick, onEditClick, onHide } = this.props;
    const { font, allNames } = this.state;

    const errors = validate(font, allNames);

    if (!_.isEmpty(errors)) {
      this.setState({ errors, showErrors: true });
      return Promise.resolve();
    }

    this.setState({ inProgress: true });

    const id = _.get(font, 'id');
    if (id) {
      return onEditClick(id, font).then(onHide);
    }

    return onAddClick(font).then(onHide);
  }

  handleNextStep() {
    const { font, allNames } = this.state;

    const resolvedName = _.upperFirst(_.camelCase(font.name));
    const nextFont = { ...font, name: resolvedName };
    const errors = validateName(nextFont, allNames);

    if (!_.isEmpty(errors)) {
      this.setState({ errors, showErrors: true });
      return;
    }

    this.setState({ nextStep: true, font: nextFont });
  }

  handleFontUploadSuccess(key, url) {
    const { font } = this.state;

    const newFont = {
      ...font,
      [key]: url,
    };
    this.setState({ font: newFont, showErrors: false });
  }

  handleFontDeleteSuccess(key) {
    const { font } = this.state;

    const newFont = {
      ...font,
      [key]: null,
    };
    this.setState({ font: newFont, showErrors: false });
  }

  handleUploadError() {
    this.setState({ showErrors: true });
  }

  handleNameChange(event) {
    const { font } = this.state;

    const newFont = {
      ...font,
      name: event.target.value,
    };
    this.setState({ font: newFont, showErrors: false });
  }

  handleResolveFileName(file, fileName) {
    const extName = path.extname(file.name);
    return `${fileName}${extName}`;
  }

  renderUploader(locKey, key, fileName) {
    const { assetManager } = this.props;
    const { errors, showErrors, font } = this.state;

    const error = _.get(errors, key);
    const src = _.get(font, key);

    const localization = {
      fileUploadError: i18next.t(LOCALIZATION.FILE_UPLOAD_ERROR),
      fileMaxSizeError: i18next.t(LOCALIZATION.FILE_MAX_SIZE_ERROR, {
        maxFileSize: 10,
      }),
      fileRejectedError: i18next.t(LOCALIZATION.FILE_REJECTED_ERROR),
      fileDeleteError: i18next.t(LOCALIZATION.FILE_DELETE_ERROR),
      noFileErrorMessage: i18next.t(LOCALIZATION.NO_FILE_ERROR_MESSAGE),
      fileUploadMessage: i18next.t(LOCALIZATION.FILE_UPLOAD_MESSAGE),
    };

    return (
      <FormGroup>
        <ControlLabel>{i18next.t(locKey)}</ControlLabel>
        <FileUploader
          className="fonts-modal__uploader"
          src={src}
          assetManager={assetManager}
          folderName="fonts"
          accept={['.ttf', '.otf']}
          shallowDelete
          onDrop={_.noop}
          localization={localization}
          onUploadSuccess={url => this.handleFontUploadSuccess(key, url)}
          onDeleteSuccess={() => this.handleFontDeleteSuccess(key)}
          onError={this.handleUploadError}
          resolveFilename={file => this.handleResolveFileName(file, fileName)}
        />
        {showErrors && error && (
          <HelpBlock className="text-error">{error}</HelpBlock>
        )}
      </FormGroup>
    );
  }

  renderFontUploaders() {
    const { font } = this.state;

    return (
      <div>
        {this.renderUploader(
          LOCALIZATION.FONT_FORM_FILE,
          'fileUrl',
          `${font.name}-Regular`,
        )}
        {this.renderUploader(
          LOCALIZATION.BOLD_FONT_FORM_FILE,
          'boldFileUrl',
          `${font.name}-Bold`,
        )}
        {this.renderUploader(
          LOCALIZATION.ITALIC_FONT_FORM_FILE,
          'italicFileUrl',
          `${font.name}-Italic`,
        )}
        {this.renderUploader(
          LOCALIZATION.BOLD_ITALIC_FONT_FORM_FILE,
          'boldItalicFileUrl',
          `${font.name}-BoldItalic`,
        )}
      </div>
    );
  }

  render() {
    const { onHide } = this.props;
    const {
      inProgress,
      errors,
      showErrors,
      font,
      nextStep,
      editMode,
    } = this.state;

    const modalTitle = editMode
      ? i18next.t(LOCALIZATION.MODAL_TITLE_EDIT_FONT)
      : i18next.t(LOCALIZATION.MODAL_TITLE_ADD_FONT);
    const buttonText = editMode
      ? i18next.t(LOCALIZATION.BUTTON_TEXT_SAVE)
      : i18next.t(LOCALIZATION.BUTTON_TEXT_ADD);

    return (
      <div className="font-modal">
        <div className="modal-title-container">
          <Button className="btn-icon pull-left" onClick={onHide}>
            <FontIcon name="back" size="24px" />
          </Button>
          {modalTitle && <h3 className="modal-title">{modalTitle}</h3>}
        </div>
        <div className="font-form">
          <form onSubmit={this.handleSubmit}>
            <FormGroup>
              <ControlLabel>
                {i18next.t(LOCALIZATION.FONT_FORM_NAME)}
              </ControlLabel>
              <input
                value={font.name}
                className="form-control"
                type="text"
                disabled={nextStep}
                onChange={this.handleNameChange}
              />
              {showErrors && errors.name && (
                <HelpBlock className="text-error">{errors.name}</HelpBlock>
              )}
            </FormGroup>
            {nextStep && this.renderFontUploaders()}
          </form>
          <ButtonToolbar>
            {!!nextStep && (
              <Button bsStyle="primary" onClick={this.handleSubmit}>
                <LoaderContainer isLoading={inProgress}>
                  {buttonText}
                </LoaderContainer>
              </Button>
            )}
            {!nextStep && (
              <Button bsStyle="primary" onClick={this.handleNextStep}>
                {i18next.t(LOCALIZATION.BUTTON_TEXT_NEXT)}
              </Button>
            )}
            <Button onClick={onHide}>
              {i18next.t(LOCALIZATION.BUTTON_TEXT_CANCEL)}
            </Button>
          </ButtonToolbar>
        </div>
      </div>
    );
  }
}

FontModal.propTypes = {
  assetManager: PropTypes.object.isRequired,
  onAddClick: PropTypes.func.isRequired,
  onEditClick: PropTypes.func.isRequired,
  onHide: PropTypes.func.isRequired,
  font: PropTypes.object,
  fonts: PropTypes.array,
};

FontModal.defaultProps = {
  font: undefined,
  fonts: [],
};
