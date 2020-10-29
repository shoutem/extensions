import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import autoBindReact from 'auto-bind/react';
import i18next from 'i18next';
import { connect } from 'react-redux';
import {
  Button,
  ButtonToolbar,
  Checkbox,
  ControlLabel,
  FormGroup,
  HelpBlock,
} from 'react-bootstrap';
import { LoaderContainer } from '@shoutem/react-web-ui';
import { updateShortcutSettings } from '@shoutem/redux-api-sdk';
import SettingField from '../../components/SettingField';
import getWeServUrl from '../../services/getWeServUrl';
import LOCALIZATION from './localization';
import './style.scss';

class RadioShortcutPage extends Component {
  static propTypes = {
    shortcut: PropTypes.object,
    updateSettings: PropTypes.func,
  };

  constructor(props) {
    super(props);
    autoBindReact(this);

    this.state = {
      errorNavbarTitle: null,
      errorBackgroundImageUrl: null,
      errorStreamTitle: null,
      errorStreamUrl: null,
      errorSharing: null,
      navbarTitle: _.get(props.shortcut, 'settings.navbarTitle'),
      streamTitle: _.get(props.shortcut, 'settings.streamTitle'),
      streamUrl: _.get(props.shortcut, 'settings.streamUrl'),
      showSharing: _.get(props.shortcut, 'settings.showSharing'),
      backgroundImageUrl: _.get(props.shortcut, 'settings.backgroundImageUrl'),
      isLoading: false,
    };
  }

  componentWillReceiveProps(nextProps) {
    const { shortcut: nextShortcut } = nextProps;
    const {
      navbarTitle,
      streamTitle,
      backgroundImageUrl,
      streamUrl,
    } = this.state;

    if (_.isEmpty(navbarTitle)) {
      this.setState({
        navbarTitle: _.get(nextShortcut, 'settings.navbarTitle'),
      });
    }

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

  handleNavbarTitleChange(event) {
    this.setState({ navbarTitle: event.target.value });
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

  async saveNavbarTitle() {
    const { shortcut, updateSettings } = this.props;
    const { navbarTitle } = this.state;

    this.setState({ errorNavbarTitle: '' });

    try {
      await updateSettings(shortcut, { navbarTitle });
    } catch (err) {
      this.setState({ errorNavbarTitle: err });
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

    await this.saveNavbarTitle();
    await this.saveStreamTitle();
    await this.saveStreamUrl();
    await this.saveShowSharing();
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
      errorBackgroundImageUrl,
      errorNavbarTitle,
      errorStreamTitle,
      errorStreamUrl,
      errorSharing,
      navbarTitle,
      streamTitle,
      streamUrl,
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
          errorText={errorNavbarTitle}
          onChange={this.handleNavbarTitleChange}
          textValue={navbarTitle}
          title={i18next.t(LOCALIZATION.FORM_NAVBAR_FIELD_TITLE)}
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
        {errorSharing && (
          <HelpBlock className="text-error">{errorSharing}</HelpBlock>
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

export default connect(null, { updateSettings: updateShortcutSettings })(
  RadioShortcutPage,
);
