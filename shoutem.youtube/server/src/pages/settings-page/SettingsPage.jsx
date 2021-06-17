import React, { Component } from 'react';
import autoBindReact from 'auto-bind/react';
import i18next from 'i18next';
import _ from 'lodash';
import PropTypes from 'prop-types';
import {
  Button,
  ButtonToolbar,
  ControlLabel,
  FormControl,
  FormGroup,
  HelpBlock,
} from 'react-bootstrap';
import { Trans } from 'react-i18next';
import { connect } from 'react-redux';
import { LoaderContainer } from '@shoutem/react-web-ui';
import {
  fetchExtension,
  updateExtensionSettings,
  getExtension,
} from '@shoutem/redux-api-sdk';
import { shouldRefresh } from '@shoutem/redux-io';
import { validateYoutubeSettings } from '../../redux';
import LOCALIZATION from './localization';
import './style.scss';

class SettingsPage extends Component {
  constructor(props) {
    super(props);

    autoBindReact(this);

    props.fetchExtension();

    this.state = {
      error: null,
      apiKey: _.get(props.extension, 'settings.apiKey'),
      hasChanges: false,
      isSaved: false,
    };
  }

  componentWillReceiveProps(nextProps) {
    const { extension } = this.props;
    const { extension: nextExtension } = nextProps;
    const { apiKey } = this.state;

    if (_.isEmpty(apiKey)) {
      const apiKey = _.get(nextExtension, 'settings.apiKey');
      const isSaved = apiKey !== undefined;
      this.setState({
        apiKey,
        isSaved,
      });
    }

    if (extension !== nextExtension && shouldRefresh(nextExtension)) {
      this.props.fetchExtension();
    }
  }

  handleTextChange(event) {
    this.setState({
      apiKey: event.target.value,
      hasChanges: true,
    });
  }

  handleSubmit(event) {
    event.preventDefault();
    this.handleSave();
  }

  handleSave() {
    const {
      extension,
      validateYoutubeSettings,
      updateExtensionSettings,
    } = this.props;
    const { apiKey } = this.state;

    this.setState({ error: '', inProgress: true });

    validateYoutubeSettings(apiKey)
      .then(() => {
        updateExtensionSettings(extension, { apiKey }).then(() => {
          this.setState({
            hasChanges: false,
            inProgress: false,
            isSaved: true,
          });
        });
      })
      .catch(() => {
        this.setState({
          error: i18next.t(LOCALIZATION.ERROR_MESSAGE),
          inProgress: false,
        });
      });
  }

  render() {
    const { error, hasChanges, inProgress, apiKey, isSaved } = this.state;
    const buttontext = isSaved
      ? i18next.t(LOCALIZATION.UPDATE_BUTTON)
      : i18next.t(LOCALIZATION.SAVE_BUTTON);

    return (
      <div className="settings-page">
        <form onSubmit={this.handleSubmit}>
          <FormGroup>
            <ControlLabel>{i18next.t(LOCALIZATION.ENTER_API_KEY)}</ControlLabel>
            <FormControl
              type="text"
              className="form-control"
              value={apiKey}
              onChange={this.handleTextChange}
            />
          </FormGroup>
          {error && <HelpBlock className="text-error">{error}</HelpBlock>}
        </form>
        <ControlLabel>
          <Trans i18nKey={LOCALIZATION.TO_CREATE_A_KEY}>
            To create your Youtube API key you need to create an app on Google
            Developer Console. You can find detailed instructions{' '}
            <a
              href="https://developers.google.com/youtube/v3/getting-started"
              target="_blank"
              rel="noopener noreferrer"
            >
              here
            </a>
            .
          </Trans>
        </ControlLabel>
        <ButtonToolbar>
          <Button
            bsStyle="primary"
            disabled={!hasChanges}
            onClick={this.handleSave}
          >
            <LoaderContainer isLoading={inProgress}>
              {buttontext}
            </LoaderContainer>
          </Button>
        </ButtonToolbar>
      </div>
    );
  }
}

SettingsPage.propTypes = {
  extension: PropTypes.object,
  fetchExtension: PropTypes.func,
  updateExtensionSettings: PropTypes.func,
  validateYoutubeSettings: PropTypes.func,
};

function mapStateToProps(state, ownProps) {
  const { extensionName } = ownProps;

  return {
    extension: getExtension(state, extensionName),
  };
}

function mapDispatchToProps(dispatch, ownProps) {
  const { extensionName } = ownProps;

  return {
    validateYoutubeSettings: apiKey =>
      dispatch(validateYoutubeSettings(apiKey)),
    fetchExtension: () => dispatch(fetchExtension(extensionName)),
    updateExtensionSettings: (extension, settings) =>
      dispatch(updateExtensionSettings(extension, settings)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(SettingsPage);
