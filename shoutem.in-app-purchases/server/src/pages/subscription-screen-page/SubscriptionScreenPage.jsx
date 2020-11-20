import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import autoBindReact from 'auto-bind/react';
import i18next from 'i18next';
import _ from 'lodash';
import {
  Button,
  ButtonToolbar,
  ControlLabel,
  FormGroup,
  FormControl,
} from 'react-bootstrap';
import { LoaderContainer, ImageUploader } from '@shoutem/react-web-ui';
import { AssetManager } from '@shoutem/assets-sdk';
import { updateExtensionSettings, getExtension } from '@shoutem/redux-api-sdk';
import { ext } from 'src/const';
import LOCALIZATION from './localization';
import './style.scss';

function resolveFilename(file) {
  const timestamp = new Date().getTime();
  const fileName = file.name ? `${timestamp}-${file.name}` : `${timestamp}`;

  return fileName;
}

export class SubscriptionScreenPage extends Component {
  constructor(props, context) {
    super(props, context);

    autoBindReact(this);

    const { appId, url } = props;
    const appsUrl = _.get(url, 'apps', {});

    this.assetManager = new AssetManager({
      scopeType: 'application',
      scopeId: appId,
      assetPolicyHost: appsUrl,
    });

    this.state = {
      ..._.get(props, 'settings', {}),
      loading: false,
    };
  }

  saveEnabled() {
    const { loading } = this.state;
    const { settings: oldSettings } = this.props;

    const newSettings = _.omit(this.state, 'loading');

    return (
      !_.isEqual(newSettings, oldSettings) &&
      !loading
    );
  }

  handleImageUploadSuccess(subscriptionScreenImageUrl) {
    this.setState({ subscriptionScreenImageUrl });
  }

  handleImageDeleteSuccess() {
    this.setState({ subscriptionScreenImageUrl: "" });
  }

  handleTextSettingChange(fieldName) {
    return event => {
      const newText = event.target.value;

      this.setState({ [fieldName]: newText });
    };
  }

  handleSave() {
    const { extension, updateExtensionSettingsAction } = this.props;

    const newSettings = _.omit(this.state, 'loading');

    this.setState({ loading: true });

    updateExtensionSettingsAction(extension, { ...newSettings })
      .then(() => this.setState({ loading: false }))
      .catch(() => this.setState({ loading: false }));
  }

  render() {
    const {
      loading,
      subscriptionScreenTitle,
      subscriptionScreenDescription,
      subscriptionScreenImageUrl,
      confirmationMessageTrial,
      confirmationMessageRegular,
    } = this.state;

    const saveEnabled = this.saveEnabled();

    return (
      <div className="subscription-screen-page">
        <h3>{i18next.t(LOCALIZATION.HEADING_TITLE)}</h3>
        <FormGroup>
          <ControlLabel>
            {i18next.t(LOCALIZATION.SUBSCRIPTION_TITLE)}
          </ControlLabel>
          <FormControl
            className="form-control"
            onChange={this.handleTextSettingChange('subscriptionScreenTitle')}
            type="text"
            value={subscriptionScreenTitle}
          />
          <ControlLabel>
            {i18next.t(LOCALIZATION.SUBSCRIPTION_DESCRIPTION)}
          </ControlLabel>
          <FormControl
            className="form-control"
            componentClass="textarea"
            cols="5"
            onChange={this.handleTextSettingChange('subscriptionScreenDescription')}
            type="text"
            value={subscriptionScreenDescription}
          />
          <ControlLabel>
            {i18next.t(LOCALIZATION.IMAGE_DESCRIPTION)}
          </ControlLabel>
          <ImageUploader
            onUploadSuccess={this.handleImageUploadSuccess}
            onDeleteSuccess={this.handleImageDeleteSuccess}
            resolveFilename={resolveFilename}
            src={subscriptionScreenImageUrl}
            elementId="imageUrl"
            previewSize="custom"
            width={375}
            height={191}
            folderName={ext()}
            assetManager={this.assetManager}
            preview={subscriptionScreenImageUrl}
          />
        </FormGroup>
        <h3>{i18next.t(LOCALIZATION.SUBSCRIPTION_CONFIRMATION_TITLE)}</h3>
        <FormGroup>
          <ControlLabel>
            {i18next.t(LOCALIZATION.SUBSCRIPTION_CONFIRMATION_TRIAL)}
          </ControlLabel>
          <FormControl
            className="form-control"
            componentClass="textarea"
            cols="5"
            onChange={this.handleTextSettingChange('confirmationMessageTrial')}
            type="text"
            value={confirmationMessageTrial}
          />
          <ControlLabel>
            {i18next.t(LOCALIZATION.SUBSCRIPTION_CONFIRMATION_REGULAR)}
          </ControlLabel>
          <FormControl
            className="form-control"
            componentClass="textarea"
            cols="5"
            onChange={this.handleTextSettingChange('confirmationMessageRegular')}
            type="text"
            value={confirmationMessageRegular}
          />
        </FormGroup>
        <ButtonToolbar>
          <Button
            bsStyle="primary"
            disabled={!saveEnabled}
            onClick={this.handleSave}
          >
            <LoaderContainer isLoading={loading}>
              {i18next.t(LOCALIZATION.SAVE_BUTTON)}
            </LoaderContainer>
          </Button>
        </ButtonToolbar>
      </div>
    );
  }
}

SubscriptionScreenPage.propTypes = {
  updateExtensionSettingsAction: PropTypes.func,
  extension: PropTypes.object,
  settings: PropTypes.object,
};

function mapStateToProps(state, ownProps) {
  const { extensionName } = ownProps;
  const extension = getExtension(state, extensionName);
  const settings = _.get(extension, 'settings', {});

  return {
    extension,
    settings,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    updateExtensionSettingsAction: (extension, settings) =>
      dispatch(updateExtensionSettings(extension, settings)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(SubscriptionScreenPage);
