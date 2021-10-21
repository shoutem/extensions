import React, { PureComponent } from 'react';
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

const API_KEY_SETUP_INSTRUCTIONS =
  'https://developer.here.com/documentation/identity-access-management/dev_guide/topics/plat-using-apikeys.html';

class ApiKeyPage extends PureComponent {
  static propTypes = {
    shortcut: PropTypes.object,
    updateExtensionSettings: PropTypes.func,
  };

  constructor(props) {
    super(props);

    autoBindReact(this);

    this.state = {
      error: null,
      geocoderApiKey: _.get(props, 'geocoderApiKey', ''),
    };
  }

  componentWillReceiveProps(nextProps) {
    const { extension, fetchExtensionAction } = this.props;
    const { extension: nextExtension } = nextProps;

    if (extension !== nextExtension && shouldRefresh(nextExtension)) {
      fetchExtensionAction();
    }
  }

  handleTextChange(event) {
    this.setState({
      geocoderApiKey: event.target.value,
    });
  }

  handleSubmit(event) {
    event.preventDefault();
    this.handleSave();
  }

  handleSave() {
    const { extension, updateExtensionSettings } = this.props;
    const { geocoderApiKey } = this.state;

    this.setState({ error: '', inProgress: true });

    updateExtensionSettings(extension, { geocoderApiKey })
      .then(() => this.setState({ inProgress: false }))
      .catch(err => {
        this.setState({ error: err, inProgress: false });
      });
  }

  render() {
    const { error, inProgress, geocoderApiKey } = this.state;
    const { geocoderApiKey: initialGeocoderApiKey } = this.props;

    const hasChanges = initialGeocoderApiKey !== geocoderApiKey;

    return (
      <div className="settings-page">
        <form onSubmit={this.handleSubmit}>
          <FormGroup>
            <h3>{i18next.t(LOCALIZATION.NAME)}</h3>
            <ControlLabel>{i18next.t(LOCALIZATION.LABEL)}</ControlLabel>
            <span>
              <a
                href={API_KEY_SETUP_INSTRUCTIONS}
                rel="noopener noreferrer"
                target="_blank"
              >
                <ControlLabel>
                  {i18next.t(LOCALIZATION.INSTRUCTIONS_MESSAGE)}
                </ControlLabel>{' '}
                {i18next.t(LOCALIZATION.INSTRUCTIONS_LINK_DESCRIPTION)}
              </a>
            </span>

            <FormControl
              type="text"
              className="form-control"
              value={geocoderApiKey}
              onChange={this.handleTextChange}
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
              {i18next.t(LOCALIZATION.SAVE_BUTTON)}
            </LoaderContainer>
          </Button>
        </ButtonToolbar>
      </div>
    );
  }
}

function mapStateToProps(state, ownProps) {
  const { extensionName } = ownProps;
  const extension = getExtension(state, extensionName);
  const geocoderApiKey = _.get(extension, 'settings.geocoderApiKey');

  return {
    extension,
    geocoderApiKey,
  };
}

function mapDispatchToProps(dispatch, ownProps) {
  const { extensionName } = ownProps;

  return {
    fetchExtensionAction: () => dispatch(fetchExtension(extensionName)),
    updateExtensionSettings: (extension, settings) =>
      dispatch(updateExtensionSettings(extension, settings)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ApiKeyPage);
