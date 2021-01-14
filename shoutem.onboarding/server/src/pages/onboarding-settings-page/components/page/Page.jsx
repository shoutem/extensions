import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  FormControl,
  ControlLabel,
  Button,
  HelpBlock,
} from 'react-bootstrap';
import autoBindReact from 'auto-bind/react';
import i18next from 'i18next';
import Select from 'react-select';
import {
  FontIconPopover,
  FontIcon,
  ImageUploader,
  ConfirmModal,
} from '@shoutem/react-web-ui';
import { ext } from 'src/const';
import LOCALIZATION from './localization';
import './style.scss';

function resolveFilename(file) {
  const timestamp = new Date().getTime();
  const fileName = file.name ? `${timestamp}-${file.name}` : `${timestamp}`;

  return fileName;
}

export default class PageSettings extends Component {
  static propTypes = {
    page: PropTypes.object,
    assetManager: PropTypes.object,
    textPositionOptions: PropTypes.array,
    onSettingsChange: PropTypes.func,
    onDelete: PropTypes.func,
    index: PropTypes.number,
  };

  constructor(props) {
    super(props);

    autoBindReact(this);

    this.state = {
      error: false,
    };
  }

  onDelete() {
    const { onDelete, index } = this.props;

    this.refs.confirm.show({
      title: i18next.t(LOCALIZATION.DELETE_TITLE),
      message: i18next.t(LOCALIZATION.DELETE_MESSAGE),
      confirmLabel: i18next.t(LOCALIZATION.DELETE_BTN_LABEL),
      abortLabel: i18next.t(LOCALIZATION.CANCEL_BTN_LABEL),
      confirmBsStyle: 'danger',
      onConfirm: () => onDelete(index),
    });
  }

  handlePageUpdate(key, value) {
    const { index, page, onSettingsChange } = this.props;
    const newPage = { ...page, [key]: value };

    onSettingsChange(newPage, index);
  }

  handleTitleChange(event) {
    this.handlePageUpdate('title', event.target.value);
  }

  handleDescriptionChange(event) {
    this.handlePageUpdate('description', event.target.value);
  }

  handleImageUpload(imageUrl) {
    this.setState({
      error: false,
    });

    this.handlePageUpdate('imageUrl', imageUrl);
  }

  handleImageUploadFailed() {
    this.setState({
      error: true,
    });
  }

  handleImageDelete() {
    this.handlePageUpdate('imageUrl', null);
  }

  handleTextPositionChange(option) {
    this.handlePageUpdate('textPosition', option);
  }

  render() {
    const { assetManager, index, textPositionOptions, page } = this.props;
    const { imageUrl, title, description, textPosition } = page;
    const { error } = this.state;

    return (
      <div className="page-container">
        <ControlLabel>
          {`#${index + 1}`}
        </ControlLabel>
        <div className="title-button">
          <ControlLabel>
            {i18next.t(LOCALIZATION.PAGE_TITLE)}
          </ControlLabel>
          <ConfirmModal ref="confirm" className="settings-page-modal-small" />
          <Button
            bsStyle="link"
            className="delete-page-button"
            onClick={this.onDelete}
          >
            <FontIconPopover
              message={i18next.t(LOCALIZATION.DELETE_BTN_MESSAGE)}
              placement="top"
            >
              <FontIcon name="delete" size="24px" />
            </FontIconPopover>
          </Button>
        </div>
        <FormControl
          className="form-control"
          onChange={this.handleTitleChange}
          type="text"
          value={title}
        />
        <ControlLabel>{i18next.t(LOCALIZATION.PAGE_DESCRIPTION)}</ControlLabel>
        <textarea
          className="form-control"
          onChange={this.handleDescriptionChange}
          value={description}
        />
        <div>
          <ControlLabel>
            {i18next.t(LOCALIZATION.TEXT_POSITION_LABEL)}
          </ControlLabel>
          <Select
            clearable={false}
            defaultValue={textPositionOptions[1]}
            onChange={this.handleTextPositionChange}
            options={textPositionOptions}
            value={textPosition}
          />
        </div>
        <ControlLabel>{i18next.t(LOCALIZATION.PAGE_IMAGE)}</ControlLabel>
        <ImageUploader
          assetManager={assetManager}
          className="image-uploader"
          elementId="imageUrl"
          folderName={ext()}
          height={1920}
          onDeleteSuccess={this.handleImageDelete}
          onDrop={this.handleImageDrop}
          onError={this.handleImageUploadFailed}
          onUploadSuccess={this.handleImageUpload}
          preview={imageUrl}
          previewSize="custom"
          resolveFilename={resolveFilename}
          src={imageUrl}
          width={1080}
        />
        {error && <HelpBlock className="text-error">{i18next.t(LOCALIZATION.UPLOAD_FAILED_MESSAGE)}</HelpBlock>}
      </div >
    );
  }
}
