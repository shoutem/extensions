import React, { PureComponent } from 'react';
import {
  Button,
  ButtonToolbar,
  ControlLabel,
  FormControl,
  FormGroup,
  HelpBlock,
} from 'react-bootstrap';
import { connect } from 'react-redux';
import autoBindReact from 'auto-bind/react';
import i18next from 'i18next';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { ext } from 'src/const';
import { AssetManager } from '@shoutem/assets-sdk';
import {
  ImageUploader,
  LoaderContainer,
  RichTextEditor,
  Switch,
} from '@shoutem/react-web-ui';
import { getExtension, updateExtensionSettings } from '@shoutem/redux-api-sdk';
import LOCALIZATION from './localization';
import './style.scss';

const SETTINGS_KEYS = [
  'subscriptionScreenTitle',
  'subscriptionScreenDescription',
  'subscriptionScreenImageUrl',
  'confirmationMessageTrial',
  'confirmationMessageRegular',
  'descriptionHtml',
  'descriptionHtmlEnabled',
];

const imagePickerLocalization = {
  emptySearchTermTitle: LOCALIZATION.EMPTY_SEARCH_TERM_TITLE,
  emptySearchTermDescription: LOCALIZATION.EMPTY_SEARCH_TERM_DESCRITION,
  emptySearchResultsTitle: LOCALIZATION.EMPTY_SEARCH_RESULTS_TITLE,
  emptySearchResultsDescription: LOCALIZATION.EMPTY_SEARCH_RESULTS_DESCRIPTION,
  footerText: i18next.t(LOCALIZATION.IMAGE_PICKER_FOOTER_TEXT),
  insertButtonTextSingular: i18next.t(
    LOCALIZATION.IMAGE_PICKER_INSERT_BUTTON_TEXT_SINGULAR,
  ),
  insertButtonTextPlural: i18next.t(
    LOCALIZATION.IMAGE_PICKER_INSERT_BUTTON_TEXT_PLURAL,
  ),
  invalidUnsplashKeyText: i18next.t(
    LOCALIZATION.IMAGE_PICKER_INVALID_ACCESS_KEY_TEXT,
  ),
  maxText: i18next.t(LOCALIZATION.MAX_TEXT),
  modalTitle: i18next.t(LOCALIZATION.IMAGE_PICKER_MODAL_TITLE),
  OnText: i18next.t(LOCALIZATION.IMAGE_PICKER_ON_TEXT),
  PhotoByText: i18next.t(LOCALIZATION.IMAGE_PICKER_PHOTO_BY_TEXT),
  UnsplashText: i18next.t(LOCALIZATION.IMAGE_PICKER_UNSPLASH_TEXT),
  searchPlaceholder: i18next.t(LOCALIZATION.IMAGE_PICKER_SEARCH_PLACEHOLDER),
  searchTabTitle: i18next.t(LOCALIZATION.IMAGE_PICKER_SEARCH_TAB_TITLE),
};

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
      error: null,
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

      this.setState({
        settings: { ...settings, [fieldName]: newText },
        error: null,
      });
    };
  }

  handleHtmlDescriptionToggle() {
    const { settings } = this.state;

    this.setState({
      error: null,
      settings: {
        ...settings,
        descriptionHtmlEnabled: !settings.descriptionHtmlEnabled,
      },
    });
  }

  handleHtmlDescriptionChange(description) {
    const { settings } = this.state;

    this.setState({
      error: null,
      settings: {
        ...settings,
        descriptionHtml: description.toString('html'),
      },
    });
  }

  async handleSave() {
    const { extension, updateExtensionSettingsAction } = this.props;
    const { settings } = this.state;

    this.setState({ loading: true, error: null });

    try {
      await updateExtensionSettingsAction(extension, settings);
      this.setState({ loading: false, error: null });
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(error);
      this.setState({
        loading: false,
        error: i18next.t(LOCALIZATION.ERROR_MESSAGE),
      });
    }
  }

  render() {
    const {
      loading,
      error,
      settings: {
        subscriptionScreenTitle,
        subscriptionScreenDescription,
        subscriptionScreenImageUrl,
        confirmationMessageTrial,
        confirmationMessageRegular,
        descriptionHtmlEnabled,
        descriptionHtml,
      },
    } = this.state;

    const saveEnabled = this.saveEnabled();

    return (
      <div className="subscription-screen-page">
        <h3>{i18next.t(LOCALIZATION.HEADING_TITLE)}</h3>
        <FormGroup>
          <FormGroup className="switch-form-group">
            <ControlLabel>
              {i18next.t(LOCALIZATION.SUBSCRIPTION_USE_HTML_EDITOR)}
            </ControlLabel>
            <Switch
              onChange={this.handleHtmlDescriptionToggle}
              value={descriptionHtmlEnabled}
            />
          </FormGroup>
          {descriptionHtmlEnabled && (
            <FormGroup>
              <RichTextEditor
                onChange={this.handleHtmlDescriptionChange}
                value={descriptionHtml}
                imagePickerLocalization={imagePickerLocalization}
              />
            </FormGroup>
          )}
          {!descriptionHtmlEnabled && (
            <FormGroup>
              <ControlLabel>
                {i18next.t(LOCALIZATION.SUBSCRIPTION_TITLE)}
              </ControlLabel>
              <FormControl
                className="form-control"
                onChange={this.handleTextSettingChange(
                  'subscriptionScreenTitle',
                )}
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
          )}
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
        {error && (
          <FormGroup validationState="error">
            <HelpBlock>{error}</HelpBlock>
          </FormGroup>
        )}
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
