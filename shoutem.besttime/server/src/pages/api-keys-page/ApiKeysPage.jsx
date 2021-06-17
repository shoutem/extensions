import React, { PureComponent } from 'react';
import autoBindReact from 'auto-bind/react';
import i18next from 'i18next';
import _ from 'lodash';
import {
  Button,
  ButtonToolbar,
  ControlLabel,
  FormControl,
  FormGroup,
  HelpBlock,
} from 'react-bootstrap';
import { connect } from 'react-redux';
import { LoaderContainer } from '@shoutem/react-web-ui';
import {
  fetchExtension,
  getExtension,
  updateExtensionSettings,
} from '@shoutem/redux-api-sdk';
import { shouldRefresh } from '@shoutem/redux-io';
import LOCALIZATION from './localization';
import './style.scss';

class ApiKeysPage extends PureComponent {
  constructor(props) {
    super(props);

    autoBindReact(this);

    props.fetchExtension();

    const extensionSettings = _.get(props, 'extension.settings', {});
    const { bestTimePrivateKey, googlePlacesKey } = extensionSettings;

    this.state = {
      bestTimePrivateKey,
      error: '',
      googlePlacesKey,
      hasChanges: false,
      inProgress: false,
    };
  }

  componentDidUpdate(prevProps) {
    const { extension, fetchExtension } = this.props;
    const { extension: prevExtension } = prevProps;

    if (extension !== prevExtension && shouldRefresh(extension)) {
      fetchExtension();
    }
  }

  handleGooglePlacesKeyTextChange(event) {
    this.setState({
      googlePlacesKey: event.target.value,
      hasChanges: true,
    });
  }

  handleBestTimePrivateKeyTextChange(event) {
    this.setState({
      bestTimePrivateKey: event.target.value,
      hasChanges: true,
    });
  }

  handleSubmit(event) {
    event.preventDefault();
    this.handleSave();
  }

  handleSave() {
    const { bestTimePrivateKey, googlePlacesKey } = this.state;

    if (!bestTimePrivateKey || !googlePlacesKey) {
      this.setState({ error: i18next.t(LOCALIZATION.REQUIRE_ALL_KEYS_ERROR) });
      return;
    }

    const { extension, updateExtensionSettings } = this.props;

    const newSettings = {
      bestTimePrivateKey,
      googlePlacesKey,
    };

    this.setState({ error: '', inProgress: true });
    updateExtensionSettings(extension, newSettings)
      .then(() =>
        this.setState({
          hasChanges: false,
          inProgress: false,
        }),
      )
      .catch(err => {
        this.setState({ error: err, inProgress: false });
      });
  }

  render() {
    const {
      bestTimePrivateKey,
      error,
      googlePlacesKey,
      hasChanges,
      inProgress,
    } = this.state;

    return (
      <div className="settings-page">
        <form onSubmit={this.handleSubmit}>
          <FormGroup>
            <ControlLabel>
              {i18next.t(LOCALIZATION.BEST_TIME_PRIVATE_KEY_LABEL)}
            </ControlLabel>
            <FormControl
              type="text"
              className="form-control"
              value={bestTimePrivateKey}
              onChange={this.handleBestTimePrivateKeyTextChange}
            />
            <ControlLabel>
              {i18next.t(LOCALIZATION.GOOGLE_PLACES_LABEL)}
            </ControlLabel>
            <FormControl
              type="text"
              className="form-control"
              value={googlePlacesKey}
              onChange={this.handleGooglePlacesKeyTextChange}
            />
          </FormGroup>
          {error && <HelpBlock className="text-error">{error}</HelpBlock>}
        </form>
        <ButtonToolbar className="save-button">
          <Button
            bsStyle="primary"
            disabled={!hasChanges}
            onClick={this.handleSave}
          >
            <LoaderContainer isLoading={inProgress}>
              {i18next.t(LOCALIZATION.API_KEYS_SAVE_BUTTON)}
            </LoaderContainer>
          </Button>
        </ButtonToolbar>
      </div>
    );
  }
}

function mapStateToProps(state, ownProps) {
  const { extensionName } = ownProps;

  return {
    extension: getExtension(state, extensionName),
  };
}

function mapDispatchToProps(dispatch, ownProps) {
  const { extensionName } = ownProps;

  return {
    fetchExtension: () => dispatch(fetchExtension(extensionName)),
    updateExtensionSettings: (extension, settings) =>
      dispatch(updateExtensionSettings(extension, settings)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ApiKeysPage);
