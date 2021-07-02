import React, { PureComponent } from 'react';
import autoBindReact from 'auto-bind/react';
import i18next from 'i18next';
import PropTypes from 'prop-types';
import {
  Button,
  ButtonToolbar,
  ControlLabel,
  FormControl,
  FormGroup,
  HelpBlock,
} from 'react-bootstrap';
import { connect } from 'react-redux';
import { Checkbox, LoaderContainer } from '@shoutem/react-web-ui';
import { updateShortcutSettings } from '@shoutem/redux-api-sdk';
import LOCALIZATION from './localization';
import './style.scss';

class SubmitMessagePage extends PureComponent {
  static propTypes = {
    shortcut: PropTypes.object,
    updateShortcutSettings: PropTypes.func,
  };

  constructor(props) {
    super(props);

    autoBindReact(this);

    const {
      shortcut: { settings = {} },
    } = props;
    const contactEmail = settings.contactEmail;
    const hasSubmitMessageScreen = settings.hasSubmitMessageScreen;
    const imageOverlayMessage = settings.imageOverlayMessage;
    const imageUrl = settings.imageUrl;
    const submitMessage = settings.submitMessage;
    const submitMessageTitle = settings.submitMessageTitle;

    this.state = {
      error: null,
      contactEmail,
      hasChanges: false,
      hasSubmitMessageScreen,
      imageOverlayMessage,
      imageUrl,
      previewedImageUrl: imageUrl,
      submitMessage,
      submitMessageTitle,
    };
  }

  handleEnableScreenChange(event) {
    this.setState({
      hasChanges: true,
      hasSubmitMessageScreen: event.target.checked,
    });
  }

  handleInputChange(event) {
    const {
      target: { name, value },
    } = event;

    this.setState({ [name]: value, hasChanges: true });
  }

  handlePreviewImage() {
    const { imageUrl } = this.state;

    this.setState({ previewedImageUrl: imageUrl });
  }

  handleSave() {
    const { shortcut, updateShortcutSettings } = this.props;
    const {
      contactEmail,
      hasSubmitMessageScreen,
      imageOverlayMessage,
      imageUrl,
      submitMessage,
      submitMessageTitle,
    } = this.state;

    const newSettings = {
      contactEmail,
      hasSubmitMessageScreen,
      imageOverlayMessage,
      imageUrl,
      submitMessage,
      submitMessageTitle,
    };

    this.setState({ error: '', inProgress: true });
    updateShortcutSettings(shortcut, newSettings)
      .then(() => this.setState({ hasChanges: false, inProgress: false }))
      .catch(err => {
        this.setState({
          error: err,
          inProgress: false,
          savedImageUrl: imageUrl,
        });
      });
  }

  render() {
    const {
      contactEmail,
      error,
      hasChanges,
      hasSubmitMessageScreen,
      imageOverlayMessage,
      imageUrl,
      inProgress,
      previewedImageUrl,
      submitMessage,
      submitMessageTitle,
    } = this.state;

    return (
      <div className="settings-page">
        <FormGroup>
          <Checkbox
            checked={hasSubmitMessageScreen}
            onChange={this.handleEnableScreenChange}
          >
            {i18next.t(LOCALIZATION.HAS_SUBMIT_MESSAGE_SCREEN_LABEL)}
          </Checkbox>
          <ControlLabel>
            {i18next.t(LOCALIZATION.CONTACT_EMAIL_LABEL)}
          </ControlLabel>
          <FormControl
            name="contactEmail"
            onChange={this.handleInputChange}
            value={contactEmail}
          />
          <div
            className={hasSubmitMessageScreen ? '' : 'no-submit-message-screen'}
          >
            <ControlLabel>
              {i18next.t(LOCALIZATION.IMAGE_URL_LABEL)}
            </ControlLabel>
            <div className="image-input">
              <FormControl
                disabled={!hasSubmitMessageScreen}
                name="imageUrl"
                onChange={this.handleInputChange}
                value={imageUrl}
              />
              <Button
                bsStyle="primary"
                className="image-preview-button"
                disabled={!hasSubmitMessageScreen}
                onClick={this.handlePreviewImage}
              >
                Preview
              </Button>
            </div>
            {!!previewedImageUrl && (
              <div className="submit-image">
                <img src={previewedImageUrl} />
              </div>
            )}
            <ControlLabel>
              {i18next.t(LOCALIZATION.IMAGE_OVERLAY_MESSAGE)}
            </ControlLabel>
            <FormControl
              disabled={!hasSubmitMessageScreen}
              name="imageOverlayMessage"
              onChange={this.handleInputChange}
              value={imageOverlayMessage}
            />
            <ControlLabel>
              {i18next.t(LOCALIZATION.SUBMIT_MESSAGE_TITLE)}
            </ControlLabel>
            <FormControl
              disabled={!hasSubmitMessageScreen}
              name="submitMessageTitle"
              onChange={this.handleInputChange}
              value={submitMessageTitle}
            />
            <ControlLabel>
              {i18next.t(LOCALIZATION.SUBMIT_MESSAGE)}
            </ControlLabel>
            <FormControl
              className="textarea-formcontrol"
              componentClass="textarea"
              disabled={!hasSubmitMessageScreen}
              name="submitMessage"
              onChange={this.handleInputChange}
              value={submitMessage}
              style={{ height: 125 }}
            />
          </div>
        </FormGroup>
        {error && <HelpBlock className="text-error">{error}</HelpBlock>}
        <ButtonToolbar className="save-button">
          <Button
            bsStyle="primary"
            disabled={!hasChanges}
            onClick={this.handleSave}
          >
            <LoaderContainer isLoading={inProgress}>
              {i18next.t(LOCALIZATION.SAVE_BUTTON)}
            </LoaderContainer>
          </Button>
        </ButtonToolbar>
      </div>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {
    updateShortcutSettings: (shortcut, settings) =>
      dispatch(updateShortcutSettings(shortcut, settings)),
  };
}

export default connect(null, mapDispatchToProps)(SubmitMessagePage);
