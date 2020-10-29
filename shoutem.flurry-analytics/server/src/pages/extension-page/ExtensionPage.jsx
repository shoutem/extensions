import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import autoBindReact from 'auto-bind/react';
import i18next from 'i18next';
import {
  Button,
  ButtonToolbar,
  ControlLabel,
  FormControl,
  FormGroup,
  HelpBlock,
} from 'react-bootstrap';
import _ from 'lodash';
import { LoaderContainer } from '@shoutem/react-web-ui';
import { updateExtensionSettings } from '@shoutem/redux-api-sdk';
import LOCALIZATION from './localization';
import './style.scss';

class ExtensionPage extends Component {
  static propTypes = {
    extension: PropTypes.object,
    updateSettings: PropTypes.func,
  };

  constructor(props) {
    super(props);
    autoBindReact(this);

    this.state = {
      error: null,
      ios: {
        apiKey: this.getDevicePlatformApiKey('ios', props.extension),
      },
      android: {
        apiKey: this.getDevicePlatformApiKey('android', props.extension),
      },
      // flag indicating if value in input field is changed
      hasChanges: false,
    };
  }

  componentWillReceiveProps(nextProps) {
    const { extension: nextExtension } = nextProps;

    this.initializeApiKeys('ios', nextExtension);
    this.initializeApiKeys('android', nextExtension);
  }

  getDevicePlatformApiKey(platform, extension) {
    return _.get(extension, ['settings', platform, 'apiKey']);
  }

  initializeApiKeys(platform, extension) {
    const apiKey = _.get(this.state, [platform, 'apiKey']);

    if (_.isEmpty(apiKey)) {
      this.setState({
        [platform]: {
          apiKey: this.getDevicePlatformApiKey(platform, extension),
        },
      });
    }
  }

  handleTextChange(event) {
    const {
      target: { name: keyName, value },
    } = event;
    const newValueForKey = _.set({}, keyName, value);

    this.setState({
      ...newValueForKey,
      hasChanges: true,
    });
  }

  handleSubmit(event) {
    event.preventDefault();
    this.handleSave();
  }

  handleSave() {
    const { extension, updateSettings } = this.props;
    const { ios, android } = this.state;
    const extensionSettings = {
      ios,
      android,
    };

    this.setState({ error: '', inProgress: true });

    updateSettings(extension, extensionSettings)
      .then(() => this.setState({ hasChanges: false, inProgress: false }))
      .catch(err => {
        this.setState({ error: err, inProgress: false });
      });
  }

  render() {
    const { error, inProgress, hasChanges, android, ios } = this.state;

    return (
      <div className="flurry-extension-page">
        <form onSubmit={this.handleSubmit}>
          <FormGroup>
            <h3>{i18next.t(LOCALIZATION.TITLE)}</h3>
            <ControlLabel>{i18next.t(LOCALIZATION.FORM_IOS)}</ControlLabel>
            <FormControl
              className="form-control"
              name="ios.apiKey"
              onChange={this.handleTextChange}
              type="text"
              value={ios.apiKey}
            />
            <ControlLabel>{i18next.t(LOCALIZATION.FORM_ANDROID)}</ControlLabel>
            <FormControl
              className="form-control"
              name="android.apiKey"
              onChange={this.handleTextChange}
              type="text"
              value={android.apiKey}
            />
          </FormGroup>
          {error && <HelpBlock className="text-error">{error}</HelpBlock>}
        </form>
        <ButtonToolbar>
          <Button
            bsStyle="primary"
            disabled={!hasChanges}
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

function mapDispatchToProps(dispatch) {
  return {
    updateSettings: (extension, settings) =>
      dispatch(updateExtensionSettings(extension, settings)),
  };
}

export default connect(null, mapDispatchToProps)(ExtensionPage);
