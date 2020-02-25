import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import {
  Button,
  ButtonToolbar,
  Checkbox,
  ControlLabel,
  FormGroup,
  HelpBlock,
} from 'react-bootstrap';
import _ from 'lodash';

import { LoaderContainer } from '@shoutem/react-web-ui';
import { updateShortcutSettings } from '@shoutem/redux-api-sdk';

import SettingField from '../../components/SettingField';
import getWeServUrl from '../../services/getWeServUrl';

import './style.scss';

class RadioShortcutPage extends Component {
  static propTypes = {
    shortcut: PropTypes.object,
    updateSettings: PropTypes.func,
  };

  constructor(props) {
    super(props);

    this.handleBackgroundImageUrlChange = this.handleBackgroundImageUrlChange.bind(this);
    this.handleNavbarTitleChange = this.handleNavbarTitleChange.bind(this);
    this.handleStreamUrlChange = this.handleStreamUrlChange.bind(this);
    this.handleStreamTitleChange = this.handleStreamTitleChange.bind(this);
    this.handleToggleCheckbox = this.handleToggleCheckbox.bind(this);
    this.handleSaveSettings = this.handleSaveSettings.bind(this);

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
      navbarTitle, streamTitle, backgroundImageUrl, streamUrl,
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
      <img alt="Background preview" src={imageSrc} />
    );
  }

  render() {
    const {
      errorBackgroundImageUrl, errorNavbarTitle, errorStreamTitle,
      errorStreamUrl, errorSharing, navbarTitle, streamTitle,
      streamUrl, showSharing, isLoading, backgroundImageUrl,
    } = this.state;

    return (
      <FormGroup>
        <ControlLabel>
          NOTE: Radio player's lock screen and notification banner controls will not appear or work in the app preview. These functionalities do work in live applications.
        </ControlLabel>
        {this.renderImage()}
        <SettingField
          errorText={errorBackgroundImageUrl}
          onChange={this.handleBackgroundImageUrlChange}
          textValue={backgroundImageUrl}
          title="Background image URL:"
          popoverMessage="Only static image formats are supported (e.g. PNG, JPEG)."
        />
        <SettingField
          errorText={errorNavbarTitle}
          onChange={this.handleNavbarTitleChange}
          textValue={navbarTitle}
          title="Navbar title:"
        />
        <SettingField
          errorText={errorStreamUrl}
          onChange={this.handleStreamUrlChange}
          textValue={streamUrl}
          title="Stream URL:"
        />
        <SettingField
          errorText={errorStreamTitle}
          onChange={this.handleStreamTitleChange}
          textValue={streamTitle}
          title="Stream title:"
        />
        <Checkbox
          checked={showSharing}
          name="Enable Sharing"
          onChange={this.handleToggleCheckbox}
        >
          Enable Sharing
        </Checkbox>
        {errorSharing && (
          <HelpBlock className="text-error">{errorSharing}</HelpBlock>
        )}
        <ButtonToolbar>
          <Button
            bsStyle="primary"
            onClick={this.handleSaveSettings}
          >
            <LoaderContainer isLoading={isLoading}>
              Save
            </LoaderContainer>
          </Button>
        </ButtonToolbar>
      </FormGroup>
    );
  }
}

export default connect(null, { updateSettings: updateShortcutSettings })(RadioShortcutPage);
