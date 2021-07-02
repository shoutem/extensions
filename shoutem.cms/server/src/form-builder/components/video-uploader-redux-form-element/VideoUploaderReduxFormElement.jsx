import React, { Component } from 'react';
import PropTypes from 'prop-types';
import autoBindReact from 'auto-bind/react';
import _ from 'lodash';
import { Row, ControlLabel, FormGroup } from 'react-bootstrap';
import { ImageUploader } from '@shoutem/file-upload';
import { ReduxFormElement } from '@shoutem/react-web-ui';

const YOUTUBE_REGEXS = [
  /((www\.)?youtube\.com\/watch\?.*v=(?<videoId>[^&]+))/,
  /((www\.)?youtube\.com\/v\/(?<videoId>[^&?]+))/,
  /((www\.)?youtube\.com\/embed\/(?<videoId>[^&?]+))/,
  /(youtu.be\/(?<videoId>[^&?]+))/,
];

function resolveFilename(file) {
  const timestamp = new Date().getTime();
  const fileName = file.name ? `${timestamp}-${file.name}` : `${timestamp}`;

  return fileName;
}

function resolveThumbnailUrl(url) {
  if (!url) {
    return null;
  }

  let youtubeVideoId = null;
  _.forEach(YOUTUBE_REGEXS, youtubeRegex => {
    const matches = url.match(youtubeRegex);
    youtubeVideoId = _.get(matches, 'groups.videoId');

    if (youtubeVideoId) {
      return false;
    }

    return true;
  });

  if (youtubeVideoId) {
    return `http://img.youtube.com/vi/${youtubeVideoId}/0.jpg`;
  }

  return null;
}

export default class VideoUploaderReduxFormElement extends Component {
  static propTypes = {
    elementId: PropTypes.string,
    assetManager: PropTypes.object,
    name: PropTypes.string,
    field: PropTypes.object,
    helpText: PropTypes.string,
    className: PropTypes.string,
    folderName: PropTypes.string,
    thumbnailName: PropTypes.string,
    touch: PropTypes.func,
  };

  constructor(props) {
    super(props);
    autoBindReact(this);

    const { elementId } = props;
    const imageElementId = `${elementId}-thumbnailurl`;

    this.state = {
      inProgress: false,
      imageElementId,
    };
  }

  handleVideoUrlChange(event) {
    const { field, touch } = this.props;

    const url = _.get(event, 'target.value');
    const value = { ...field.value, url };

    // if thumbnailurl doesn't exist check if we can parse video thumbnailurl
    const thumbnailurl = _.get(field.value, 'thumbnailurl');
    if (!thumbnailurl) {
      const parsedThumbnailUrl = resolveThumbnailUrl(url);
      if (parsedThumbnailUrl) {
        _.set(value, 'thumbnailurl', parsedThumbnailUrl);
      }
    }

    field.onChange(value);

    if (_.isFunction(touch)) {
      touch([field.name]);
    }
  }

  handleImageDrop() {
    this.setState({ inProgress: true });
  }

  async handleImageUploadSuccess(imageUrl) {
    const { field } = this.props;

    const value = { ...field.value, thumbnailurl: imageUrl };
    field.onChange(value);

    this.setState({ inProgress: false });
  }

  handleImageDeleteSuccess() {
    const { field } = this.props;
    const value = { ...field.value, thumbnailurl: null };

    field.onChange(value);
  }

  handlePreviewClick(link) {
    if (link) {
      window.open(link, '_blank');
    }
  }

  render() {
    const {
      assetManager,
      elementId,
      field,
      name,
      thumbnailName,
      className,
      folderName,
      ...otherProps
    } = this.props;
    const { imageElementId } = this.state;

    const videoField = _.cloneDeep(field);
    videoField.value = _.get(field, 'value.url');
    const imageUrl = _.get(field, 'value.thumbnailurl');

    return (
      <Row>
        <ReduxFormElement
          {...otherProps}
          elementId={elementId}
          name={name}
          field={videoField}
          onChange={this.handleVideoUrlChange}
          onUpdate={this.handleVideoUrlChange}
          onDrop={this.handleVideoUrlChange}
          onBlur={this.handleVideoUrlChange}
        />
        <FormGroup className={className} controlId={imageElementId}>
          {thumbnailName && <ControlLabel>{thumbnailName}</ControlLabel>}
          <ImageUploader
            accept="image/*"
            assetManager={assetManager}
            folderName={folderName}
            onDeleteSuccess={this.handleImageDeleteSuccess}
            onDrop={this.handleImageDrop}
            onUploadSuccess={this.handleImageUploadSuccess}
            resolveFilename={resolveFilename}
            onPreviewClick={this.handlePreviewClick}
            shallowDelete
            src={imageUrl}
          />
        </FormGroup>
      </Row>
    );
  }
}
