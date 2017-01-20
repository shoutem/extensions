import React, { PropTypes, Component } from 'react';
import { ControlLabel, Row, Col, FormGroup } from 'react-bootstrap';
import { ImageUploader, S3Uploader } from '@shoutem/web-core';
import { url, appId, awsDefaultBucket } from 'environment';
import form from './form';
import DropdownWrapper from './DropdownWrapper';

const configuration = {
  default: {
    parallaxEffect: 'onDeviceOrientation',
  },
  parallaxEffect: {
    onDeviceOrientation: 'On device orientation',
    onScroll: 'On scroll',
  },
};

export class BackgroundSettings extends Component {
  constructor(props) {
    super(props);
    this.saveForm = this.saveForm.bind(this);

    props.onFieldChange(this.saveForm);
    this.uploader = new S3Uploader({
      appId,
      basePolicyServerPath: url.apps,
      folderName: 'images',
      awsBucket: awsDefaultBucket,
    });
  }

  saveForm() {
    const newSettings = this.props.form.toObject();
    this.props.onSettingsChanged(newSettings);
  }

  render() {
    const { parallaxEffect, backgroundImage } = this.props.fields;
    const minWidth = 750;
    const minHeight = 1136;

    return (
      <div>
        <h3>Background settings</h3>
        <form>
          <FormGroup>
            <Row>
              <Col md={6}>
                <ControlLabel>{`Screen background (min ${minWidth}x${minHeight}px)`}</ControlLabel>
                <ImageUploader
                  previewSize="large"
                  onUploadSuccess={backgroundImage.onChange}
                  preview={backgroundImage.value}
                  minWidth={minWidth}
                  minHeight={minHeight}
                  icon="add-photo"
                  uploader={this.uploader}
                  canBeDeleted={false}
                />
              </Col>
              <Col md={6}>
                <ControlLabel>Parallax effect</ControlLabel>
                <DropdownWrapper
                  valuesMap={configuration.parallaxEffect}
                  defaultKey={configuration.default.parallaxEffect}
                  field={parallaxEffect}
                />
              </Col>
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
    fields: ['parallaxEffect', 'backgroundImage'],
    defaultValues: {
      parallaxEffect: settings.parallaxEffect,
      backgroundImage: settings.backgroundImage,
    },
    validation: {},
  };
})(BackgroundSettings);
