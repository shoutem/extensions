import React, { Component } from 'react';
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
import {
  FontIcon,
  FontIconPopover,
  LoaderContainer,
  Switch,
} from '@shoutem/react-web-ui';
import {
  fetchExtension,
  updateExtensionSettings,
} from '@shoutem/redux-api-sdk';
import { shouldLoad } from '@shoutem/redux-io';
import LOCALIZATION from './localization';
import './style.scss';

const MIN_STATUS_LENGTH = 1;
const MAX_STATUS_LENGTH = 4000;

class SocialSettingsPage extends Component {
  constructor(props) {
    super(props);
    autoBindReact(this);

    const settings = _.get(this.props, 'ownExtension.settings', {});
    this.state = {
      settings,
      error: null,
      maxStatusLengthError: null,
    };
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const { fetchExtension } = this.props;

    if (shouldLoad(nextProps, this.props, 'ownExtension')) {
      fetchExtension();
    }
  }

  handleMaxStatusLengthChange(event) {
    const { settings } = this.state;

    let maxStatusLengthError = null;
    const maxStatusLength = Number(event.target.value);
    if (maxStatusLength < 0) {
      maxStatusLengthError = `${i18next.t(
        LOCALIZATION.STATUS_LENGTH_MUST_BE_GREATER_OR_EQUAL,
      )} ${MIN_STATUS_LENGTH}`;
    }

    if (maxStatusLength > 4000) {
      maxStatusLengthError = `${i18next.t(
        LOCALIZATION.STATUS_LENGTH_MUST_BE_LOWER_OR_EQUAL,
      )} ${MAX_STATUS_LENGTH}`;
    }

    this.setState({
      maxStatusLengthError,
      settings: {
        ...settings,
        maxStatusLength,
      },
    });
  }

  handleTogglePhotoAttachments() {
    const { settings } = this.state;
    const { enablePhotoAttachments } = settings;

    this.setState({
      settings: {
        ...settings,
        enablePhotoAttachments: !enablePhotoAttachments,
      },
    });
  }

  handleToggleGifAttachments() {
    const { settings } = this.state;
    const { enableGifAttachments } = settings;

    this.setState({
      settings: {
        ...settings,
        enableGifAttachments: !enableGifAttachments,
      },
    });
  }

  handleToggleComments() {
    const { settings } = this.state;
    const { enableComments } = settings;

    this.setState({
      settings: {
        ...settings,
        enableComments: !enableComments,
      },
    });
  }

  handleToggleInteractions() {
    const { settings } = this.state;
    const { enableInteractions } = settings;

    this.setState({
      settings: {
        ...settings,
        enableInteractions: !enableInteractions,
      },
    });
  }

  handleSubmit(event) {
    event.preventDefault();
    this.handleSave();
  }

  handleSave() {
    const { extension, updateExtensionSettings } = this.props;
    const { settings } = this.state;

    this.setState({ error: null, inProgress: true });

    return updateExtensionSettings(extension, settings)
      .then(() => this.setState({ inProgress: false }))
      .catch(() =>
        this.setState({
          error: i18next.t(LOCALIZATION.ERROR_TEXT),
          inProgress: false,
        }),
      );
  }

  render() {
    const { error, maxStatusLengthError, inProgress, settings } = this.state;
    const {
      maxStatusLength,
      enablePhotoAttachments,
      enableGifAttachments,
      enableComments,
      enableInteractions,
    } = settings;

    const initialSettings = _.get(this.props, 'ownExtension.settings', {});
    const hasChanges = !_.isEqual(settings, initialSettings);
    const isDisabled = !hasChanges || !!maxStatusLengthError;

    return (
      <div className="social-settings-page">
        <form onSubmit={this.handleSubmit}>
          <h3>{i18next.t(LOCALIZATION.TITLE)}</h3>
          <FormGroup className="social-settings-page__status-length">
            <ControlLabel>
              {i18next.t(LOCALIZATION.FORM_TITLE_STATUS_LENGTH)}
            </ControlLabel>
            <FormControl
              type="number"
              className="form-control"
              min={MIN_STATUS_LENGTH}
              max={MAX_STATUS_LENGTH}
              value={maxStatusLength}
              onChange={this.handleMaxStatusLengthChange}
            />
            {maxStatusLengthError && (
              <HelpBlock className="text-error">
                {maxStatusLengthError}
              </HelpBlock>
            )}
          </FormGroup>
          <FormGroup className="social-settings-page__photos">
            <ControlLabel>
              {i18next.t(LOCALIZATION.FORM_TITLE_ATTACHMENTS)}
            </ControlLabel>
            <Switch
              className="social-settings-page__switch"
              onChange={this.handleTogglePhotoAttachments}
              value={enablePhotoAttachments}
            />
          </FormGroup>
          <FormGroup className="social-settings-page__photos">
            <ControlLabel>
              {i18next.t(LOCALIZATION.FORM_TITLE_GIF_ATTACHMENTS)}
            </ControlLabel>
            <Switch
              className="social-settings-page__switch"
              onChange={this.handleToggleGifAttachments}
              value={enableGifAttachments}
            />
          </FormGroup>
          <FormGroup className="social-settings-page__comments">
            <ControlLabel>
              {i18next.t(LOCALIZATION.FORM_TITLE_COMMENTS)}
            </ControlLabel>
            <Switch
              className="social-settings-page__switch"
              onChange={this.handleToggleComments}
              value={enableComments}
            />
          </FormGroup>
          <FormGroup className="social-settings-page__interactions">
            <ControlLabel>
              {i18next.t(LOCALIZATION.FORM_TITLE_INTERACTIONS)}
            </ControlLabel>
            <Switch
              className="social-settings-page__switch"
              onChange={this.handleToggleInteractions}
              value={enableInteractions}
            />
            <FontIconPopover
              message={i18next.t(LOCALIZATION.POPOVER_ENABLE_LIKE_TEXT)}
            >
              <FontIcon
                className="social-settings-page__icon-popover"
                name="info"
                size="24px"
              />
            </FontIconPopover>
          </FormGroup>
          {error && <HelpBlock className="text-error">{error}</HelpBlock>}
        </form>
        <ButtonToolbar>
          <Button
            bsStyle="primary"
            disabled={isDisabled}
            onClick={this.handleSave}
          >
            <LoaderContainer isLoading={inProgress}>
              {i18next.t(LOCALIZATION.BUTTON_SAVE)}
            </LoaderContainer>
          </Button>
        </ButtonToolbar>
      </div>
    );
  }
}

SocialSettingsPage.propTypes = {
  extension: PropTypes.object.isRequired,
  fetchExtension: PropTypes.func.isRequired,
  ownExtension: PropTypes.object.isRequired,
  updateExtensionSettings: PropTypes.func.isRequired,
};

function mapDispatchToProps(dispatch, ownProps) {
  const { ownExtensionName } = ownProps;

  return {
    fetchExtension: () => dispatch(fetchExtension(ownExtensionName)),
    updateExtensionSettings: (extension, settings) =>
      dispatch(updateExtensionSettings(extension, settings)),
  };
}

export default connect(null, mapDispatchToProps)(SocialSettingsPage);
