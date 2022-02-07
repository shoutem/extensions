import React, { PureComponent } from 'react';
import {
  Button,
  ButtonToolbar,
  ControlLabel,
  FormControl,
  FormGroup,
} from 'react-bootstrap';
import { connect } from 'react-redux';
import autoBindReact from 'auto-bind/react';
import i18next from 'i18next';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { ext } from 'src/const';
import { AssetManager } from '@shoutem/assets-sdk';
import { ImageUploader, LoaderContainer } from '@shoutem/react-web-ui';
import { getExtension, updateExtensionSettings } from '@shoutem/redux-api-sdk';
import LOCALIZATION from './localization';
import './style.scss';

const SETTINGS_KEYS = [
  'subscriptionScreenTitle',
  'subscriptionScreenDescription',
  'subscriptionScreenImageUrl',
  'confirmationMessageTrial',
  'confirmationMessageRegular',
];

function resolveFilename(file) {
  const timestamp = new Date().getTime();
  const fileName = file.name ? `${timestamp}-${file.name}` : `${timestamp}`;

  return fileName;
}

export class SubscriptionScreenPage extends PureComponent {
  static getDerivedStateFromProps(props, state) {
    const { settings } = props.extension;

    const prevSettings = _.pick(settings, SETTINGS_KEYS);
    const newSettings = _.pick(state.settings, SETTINGS_KEYS);

    if (!_.isEqual(prevSettings, newSettings)) {
      return {
        ...state,
        settings: newSettings,
      };
    }

    return state;
  }

  constructor(props, context) {
    super(props, context);

    autoBindReact(this);

    const {
      appId,
      url,
      extension: { settings },
    } = props;
    const appsUrl = _.get(url, 'apps', {});

    this.assetManager = new AssetManager({
      scopeType: 'application',
      scopeId: appId,
      assetPolicyHost: appsUrl,
    });

    this.state = {
      loading: false,
      settings: _.pick(settings, SETTINGS_KEYS),
    };
  }

  saveEnabled() {
    const { loading } = this.state;

    if (loading) {
      return false;
    }

    const { settings } = this.state;
    const {
      extension: { settings: prevSettings },
    } = this.props;

    return !_.isEqual(
      _.pick(prevSettings, SETTINGS_KEYS),
      _.pick(settings, SETTINGS_KEYS),
    );
  }

  handleImageUploadSuccess(subscriptionScreenImageUrl) {
    const { settings } = this.state;

    this.setState({ settings: { ...settings, subscriptionScreenImageUrl } });
  }

  handleImageDeleteSuccess() {
    const { settings } = this.state;

    this.setState({
      settings: { ...settings, subscriptionScreenImageUrl: '' },
    });
  }

  handleTextSettingChange(fieldName) {
    const { settings } = this.state;

    return event => {
      const newText = event.target.value;

      this.setState({ settings: { ...settings, [fieldName]: newText } });
    };
  }

  handleSave() {
    const { extension, updateExtensionSettingsAction } = this.props;
    const { settings } = this.state;

    this.setState({ loading: true });

    updateExtensionSettingsAction(extension, settings).finally(() =>
      this.setState({ loading: false }),
    );
  }

  render() {
    const {
      loading,
      settings: {
        subscriptionScreenTitle,
        subscriptionScreenDescription,
        subscriptionScreenImageUrl,
        confirmationMessageTrial,
        confirmationMessageRegular,
      },
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
            onChange={this.handleTextSettingChange(
              'subscriptionScreenDescription',
            )}
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
            onChange={this.handleTextSettingChange(
              'confirmationMessageRegular',
            )}
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
  appId: PropTypes.string.isRequired,
  extension: PropTypes.object.isRequired,
  updateExtensionSettingsAction: PropTypes.func.isRequired,
  url: PropTypes.object.isRequired,
};

function mapStateToProps(state, ownProps) {
  const { extensionName } = ownProps;
  const extension = getExtension(state, extensionName);

  return {
    extension,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    updateExtensionSettingsAction: (extension, settings) =>
      dispatch(updateExtensionSettings(extension, settings)),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SubscriptionScreenPage);
