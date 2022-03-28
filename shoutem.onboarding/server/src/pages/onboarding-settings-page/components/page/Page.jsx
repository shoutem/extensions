import React, { Component } from 'react';
import { Button, ControlLabel, FormControl, HelpBlock } from 'react-bootstrap';
import Select from 'react-select';
import autoBindReact from 'auto-bind/react';
import i18next from 'i18next';
import PropTypes from 'prop-types';
import { ext } from 'src/const';
import {
  ConfirmModal,
  FontIcon,
  FontIconPopover,
  ImageUploader,
} from '@shoutem/react-web-ui';
import LOCALIZATION from './localization';
import './style.scss';

function resolveFilename(file) {
  const timestamp = new Date().getTime();
  const fileName = file.name ? `${timestamp}-${file.name}` : `${timestamp}`;

  return fileName;
}

export default class PageSettings extends Component {
  constructor(props) {
    super(props);

    autoBindReact(this);

    this.state = {
      imageError: false,
      featuredImageError: false,
      errorMessage: i18next.t(LOCALIZATION.UPLOAD_FAILED_MESSAGE),
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
      imageError: false,
    });

    this.handlePageUpdate('imageUrl', imageUrl);
  }

  handleFeaturedImageUpload(imageUrl) {
    this.setState({
      featuredImageError: false,
    });

    this.handlePageUpdate('featuredImageUrl', imageUrl);
  }

  handleImageUploadFailed(error) {
    this.setState({
      imageError: true,
      errorMessage: error || i18next.t(LOCALIZATION.UPLOAD_FAILED_MESSAGE),
    });
  }

  handleFeaturedImageUploadFailed() {
    this.setState({
      imageError: true,
    });
  }

  handleImageDelete() {
    this.handlePageUpdate('imageUrl', null);
  }

  handleFeaturedImageDelete() {
    this.handlePageUpdate('featuredImageUrl', null);
  }

  handleTextPositionChange(option) {
    this.handlePageUpdate('textPosition', option);
  }

  render() {
    const { assetManager, index, textPositionOptions, page } = this.props;
    const {
      imageUrl,
      featuredImageUrl,
      title,
      description,
      textPosition,
    } = page;
    const { imageError, errorMessage, featuredImageError } = this.state;

    return (
      <div className="page-container">
        <ControlLabel>{`#${index + 1}`}</ControlLabel>
        <div className="title-button">
          <ControlLabel>{i18next.t(LOCALIZATION.PAGE_TITLE)}</ControlLabel>
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

        <div className="image-upload__container">
          <div>
            <ControlLabel>
              {i18next.t(LOCALIZATION.PAGE_IMAGE)}
              <br />
              {i18next.t(LOCALIZATION.PAGE_IMAGE_SIZE)}
            </ControlLabel>
            <ImageUploader
              acceptType="image/png"
              assetManager={assetManager}
              className="image-uploader-background"
              elementId="imageUrl"
              folderName={ext()}
              height={1920}
              onDeleteSuccess={this.handleImageDelete}
              onDrop={this.handleImageUpload}
              onError={this.handleImageUploadFailed}
              onUploadSuccess={this.handleImageUpload}
              preview={imageUrl}
              previewSize="custom"
              resolveFilename={resolveFilename}
              src={imageUrl}
              width={1080}
            />
          </div>
          <div className="image-uploader-featured__container">
            <ControlLabel>
              {i18next.t(LOCALIZATION.FEATURED_IMAGE)}
              <br />
              {i18next.t(LOCALIZATION.FEATURED_IMAGE_SIZE)}
            </ControlLabel>
            <ImageUploader
              acceptType="image/png"
              assetManager={assetManager}
              className="image-uploader-featured"
              elementId="featuredImageUrl"
              folderName={ext()}
              minHeight={300}
              minWidth={300}
              onDeleteSuccess={this.handleFeaturedImageDelete}
              onDrop={this.handleFeaturedImageUpload}
              onError={this.handleImageUploadFailed}
              onUploadSuccess={this.handleFeaturedImageUpload}
              preview={featuredImageUrl}
              previewSize="featured"
              resolveFilename={resolveFilename}
              src={featuredImageUrl}
            />
          </div>
        </div>
        {(imageError || featuredImageError) && (
          <HelpBlock className="text-error">{errorMessage}</HelpBlock>
        )}
      </div>
    );
  }
}

PageSettings.propTypes = {
  assetManager: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired,
  page: PropTypes.object.isRequired,
  textPositionOptions: PropTypes.array.isRequired,
  onDelete: PropTypes.func.isRequired,
  onSettingsChange: PropTypes.func.isRequired,
};
