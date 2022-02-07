import React, { Component } from 'react';
import {
  Button,
  ButtonToolbar,
  Checkbox,
  ControlLabel,
  FormGroup,
  HelpBlock,
} from 'react-bootstrap';
import { connect } from 'react-redux';
import autoBindReact from 'auto-bind/react';
import i18next from 'i18next';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { LoaderContainer } from '@shoutem/react-web-ui';
import { updateShortcutSettings } from '@shoutem/redux-api-sdk';
import SettingField from '../../components/SettingField';
import getWeServUrl from '../../services/getWeServUrl';
import LOCALIZATION from './localization';
import './style.scss';

class RadioShortcutPage extends Component {
  constructor(props) {
    super(props);
    autoBindReact(this);

    const {
      shortcut: { settings = {} },
    } = props;

    this.state = {
      errorBackgroundImageUrl: null,
      errorStreamTitle: null,
      errorStreamUrl: null,
      errorSharing: null,
      errorArtwork: null,
      streamTitle: settings.streamTitle,
      streamUrl: settings.streamUrl,
      showSharing: settings.showSharing || false,
      showArtwork: settings.showArtwork || false,
      backgroundImageUrl: settings.backgroundImageUrl,
      isLoading: false,
    };
  }

  componentWillReceiveProps(nextProps) {
    const { shortcut: nextShortcut } = nextProps;
    const { streamTitle, backgroundImageUrl, streamUrl } = this.state;

    if (_.isEmpty(backgroundImageUrl)) {
      this.setState({
        backgroundImageUrl: _.get(nextShortcut, 'settings.backgroundImageUrl'),
      });
    }

    if (_.isEmpty(streamTitle)) {
      this.setState({
        streamTitle: _.get(nextShortcut, 'settings.streamTitle'),
      });
    }

    if (_.isEmpty(streamUrl)) {
      this.setState({
        streamUrl: _.get(nextShortcut, 'settings.streamUrl'),
      });
    }
  }

  handleBackgroundImageUrlChange(event) {
    this.setState({ backgroundImageUrl: event.target.value });
  }

  handleStreamUrlChange(event) {
    this.setState({ streamUrl: event.target.value });
  }

  handleStreamTitleChange(event) {
    this.setState({ streamTitle: event.target.value });
  }

  handleToggleCheckbox() {
    const { showSharing } = this.state;

    this.setState({ showSharing: !showSharing });
  }

  handleToggleArtwork() {
    const { showArtwork } = this.state;

    this.setState({ showArtwork: !showArtwork });
  }

  async saveBackgroundImageUrl() {
    const { shortcut, updateSettings } = this.props;
    const { backgroundImageUrl } = this.state;

    this.setState({ errorBackgroundImageUrl: '' });

    try {
      await updateSettings(shortcut, { backgroundImageUrl });
    } catch (err) {
      this.setState({ errorBackgroundImageUrl: err });
    }
  }

  async saveStreamUrl() {
    const { shortcut, updateSettings } = this.props;
    const { streamUrl } = this.state;

    this.setState({ errorStreamUrl: '' });

    try {
      await updateSettings(shortcut, { streamUrl });
    } catch (err) {
      this.setState({ errorStreamUrl: err });
    }
  }

  async saveShowSharing() {
    const { shortcut, updateSettings } = this.props;
    const { showSharing } = this.state;

    try {
      await updateSettings(shortcut, { showSharing });
    } catch (err) {
      this.setState({ errorSharing: err });
    }
  }

  async saveShowArtwork() {
    const { shortcut, updateSettings } = this.props;
    const { showArtwork } = this.state;

    try {
      await updateSettings(shortcut, { showArtwork });
    } catch (err) {
      this.setState({ errorArtwork: err });
    }
  }

  async saveStreamTitle() {
    const { shortcut, updateSettings } = this.props;
    const { streamTitle } = this.state;

    this.setState({ errorStreamTitle: '' });

    try {
      await updateSettings(shortcut, { streamTitle });
    } catch (err) {
      this.setState({ errorStreamTitle: err });
    }
  }

  async handleSaveSettings() {
    this.setState({ isLoading: true });

    await this.saveStreamTitle();
    await this.saveStreamUrl();
    await this.saveShowSharing();
    await this.saveShowArtwork();
    await this.saveBackgroundImageUrl();

    this.setState({ isLoading: false });
  }

  renderImage() {
    const { backgroundImageUrl } = this.state;

    if (!backgroundImageUrl) {
      return null;
    }

    const imageSrc = getWeServUrl(backgroundImageUrl, 200);

    return (
      <img
        alt={i18next.t(LOCALIZATION.BACKGROUND_IMAGE_ALT_TEXT)}
        src={imageSrc}
      />
    );
  }

  render() {
    const {
      errorArtwork,
      errorBackgroundImageUrl,
      errorStreamTitle,
      errorStreamUrl,
      errorSharing,
      streamTitle,
      streamUrl,
      showArtwork,
      showSharing,
      isLoading,
      backgroundImageUrl,
    } = this.state;

    return (
      <FormGroup>
        <ControlLabel>{i18next.t(LOCALIZATION.FORM_LABEL_NOTE)}</ControlLabel>
        {this.renderImage()}
        <SettingField
          errorText={errorBackgroundImageUrl}
          onChange={this.handleBackgroundImageUrlChange}
          textValue={backgroundImageUrl}
          title={i18next.t(LOCALIZATION.FORM_BACKGROUND_FIELD_TITLE)}
          popoverMessage={i18next.t(LOCALIZATION.FORM_BACKGROUND_FIELD_POPOVER)}
        />
        <SettingField
          errorText={errorStreamUrl}
          onChange={this.handleStreamUrlChange}
          textValue={streamUrl}
          title={i18next.t(LOCALIZATION.FORM_STREAM_URL_FIELD_TITLE)}
        />
        <SettingField
          errorText={errorStreamTitle}
          onChange={this.handleStreamTitleChange}
          textValue={streamTitle}
          title={i18next.t(LOCALIZATION.FORM_STREAM_FIELD_TITLE)}
        />
        <Checkbox
          checked={showSharing}
          name="Enable Sharing"
          onChange={this.handleToggleCheckbox}
        >
          {i18next.t(LOCALIZATION.FORM_SHARING_CHECKBOX_TITLE)}
        </Checkbox>
        {!!errorSharing && (
          <HelpBlock className="text-error">{errorSharing}</HelpBlock>
        )}
        <Checkbox
          checked={showArtwork}
          name="Display artwork"
          onChange={this.handleToggleArtwork}
        >
          {i18next.t(LOCALIZATION.FORM_ARTWORK_CHECKBOX_TITLE)}
        </Checkbox>
        {!!errorArtwork && (
          <HelpBlock className="text-error">{errorArtwork}</HelpBlock>
        )}
        <ButtonToolbar>
          <Button bsStyle="primary" onClick={this.handleSaveSettings}>
            <LoaderContainer isLoading={isLoading}>
              {i18next.t(LOCALIZATION.BUTTON_SAVE)}
            </LoaderContainer>
          </Button>
        </ButtonToolbar>
      </FormGroup>
    );
  }
}

RadioShortcutPage.propTypes = {
  shortcut: PropTypes.object.isRequired,
  updateSettings: PropTypes.func.isRequired,
};

export default connect(null, { updateSettings: updateShortcutSettings })(
  RadioShortcutPage,
);
