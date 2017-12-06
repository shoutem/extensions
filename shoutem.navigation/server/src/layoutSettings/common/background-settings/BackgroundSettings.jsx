import React, { PropTypes, Component } from 'react';
import _ from 'lodash';
import { ControlLabel, Row, Col, FormGroup } from 'react-bootstrap';
import { ImageUploader } from '@shoutem/web-core';
import { url, appId, getAppPublishSettings } from 'environment';
import { UndeletableS3Uploader } from '../../../fileUpload';
import form from '../form';
import './style.scss';

const TABLET_BACKGROUND_SCREEN_MIN_WIDTH = 1536;
const TABLET_BACKGROUND_SCREEN_MIN_HEIGHT = 2048;

const BACKGROUND_SCREEN_MIN_WIDTH = 750;
const BACKGROUND_SCREEN_MIN_HEIGHT = 1136;

function shouldUseUniversalBuild(publishSettings) {
  return _.get(publishSettings, 'ios.useUniversalBuild', false);
}

export class BackgroundSettings extends Component {
  constructor(props) {
    super(props);

    this.saveForm = this.saveForm.bind(this);
    this.handleBackgroundDeleteSuccess = this.handleBackgroundDeleteSuccess.bind(this);
    this.handleTabletBackgroundDeleteSuccess = this.handleTabletBackgroundDeleteSuccess.bind(this);
    this.renderBackgroundImage = this.renderBackgroundImage.bind(this);
    this.renderTabletBackgroundImage = this.renderTabletBackgroundImage.bind(this);

    props.onFieldChange(this.saveForm);
    this.uploader = new UndeletableS3Uploader({
      appId,
      basePolicyServerPath: url.apps,
      folderName: 'images',
    });

    const appPublishSettings = getAppPublishSettings();
    const useUniversalBuild = shouldUseUniversalBuild(appPublishSettings);

    this.state = {
      useUniversalBuild,
    };
  }

  saveForm() {
    const newSettings = this.props.form.toObject();
    this.props.onSettingsChanged(newSettings);
  }

  handleBackgroundDeleteSuccess() {
    const { onSettingsChanged } = this.props;
    const newSettings = {
      backgroundImage: null,
    };
    onSettingsChanged(newSettings);
  }

  handleTabletBackgroundDeleteSuccess() {
    const { onSettingsChanged } = this.props;
    const newSettings = {
      tabletBackgroundImage: null,
    };
    onSettingsChanged(newSettings);
  }

  renderTabletBackgroundImage() {
    const {
      fields: {
        tabletBackgroundImage,
      },
    } = this.props;

    return (
      <Col md={6}>
        <ControlLabel>
          {`Tablet screen background
           (min ${TABLET_BACKGROUND_SCREEN_MIN_WIDTH}x${TABLET_BACKGROUND_SCREEN_MIN_HEIGHT}px)`}
        </ControlLabel>
        <ImageUploader
          previewSize="tablet"
          onUploadSuccess={tabletBackgroundImage.onChange}
          preview={tabletBackgroundImage.value}
          minWidth={TABLET_BACKGROUND_SCREEN_MIN_WIDTH}
          minHeight={TABLET_BACKGROUND_SCREEN_MIN_HEIGHT}
          icon="add-photo"
          uploader={this.uploader}
          onDeleteSuccess={this.handleTabletBackgroundDeleteSuccess}
        />
      </Col>
    );
  }

  renderBackgroundImage() {
    const {
      fields: {
        backgroundImage,
      },
    } = this.props;

    return (
      <Col md={6}>
        <ControlLabel>
          {`Screen background
                   (min ${BACKGROUND_SCREEN_MIN_WIDTH}x${BACKGROUND_SCREEN_MIN_HEIGHT}px)`}
        </ControlLabel>
        <ImageUploader
          previewSize="custom"
          onUploadSuccess={backgroundImage.onChange}
          preview={backgroundImage.value}
          minWidth={BACKGROUND_SCREEN_MIN_WIDTH}
          minHeight={BACKGROUND_SCREEN_MIN_HEIGHT}
          icon="add-photo"
          uploader={this.uploader}
          onDeleteSuccess={this.handleBackgroundDeleteSuccess}
        />
      </Col>
    );
  }

  render() {
    const { useUniversalBuild } = this.state;

    return (
      <div className="background-settings">
        <h3>Background settings</h3>
        <form>
          <FormGroup>
            <Row>
              {this.renderBackgroundImage()}
              {useUniversalBuild && this.renderTabletBackgroundImage()}
            </Row>
          </FormGroup>
        </form>
      </div>
    );
  }
}

BackgroundSettings.propTypes = {
  settings: PropTypes.object.isRequired,
  onSettingsChanged: PropTypes.func.isRequired,
  onFieldChange: PropTypes.func,
  form: PropTypes.string,
  fields: PropTypes.arrayOf(PropTypes.string),
};

export default form((props) => {
  const { settings } = props;
  return {
    fields: [
      'parallaxEffect',
      'backgroundImage',
      'tabletBackgroundImage',
    ],
    defaultValues: {
      parallaxEffect: settings.parallaxEffect,
      backgroundImage: settings.backgroundImage,
      tabletBackgroundImage: settings.tabletBackgroundImage,
    },
    validation: {},
  };
})(BackgroundSettings);
