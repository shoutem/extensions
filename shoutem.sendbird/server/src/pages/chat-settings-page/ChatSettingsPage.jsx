import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import autoBindReact from 'auto-bind/react';
import {
  Button,
  ButtonToolbar,
  ControlLabel,
  FormControl,
  FormGroup,
  HelpBlock,
} from 'react-bootstrap';
import { LoaderContainer } from '@shoutem/react-web-ui';
import {
  fetchExtension,
  updateExtensionSettings,
  getExtension,
} from '@shoutem/redux-api-sdk';
import { shouldRefresh } from '@shoutem/redux-io';
import { connect } from 'react-redux';
import { SendBird } from '../../services';
import { selectors, actions } from '../../state';
import { ChatDisabledPlaceholder, CollapsiblePanel } from '../../components';
import './style.scss';

const ERROR_APP_ID = 'Invalid App ID';
const ACCOUNT_INVITATION_SUPPORT_PAGE = 'https://shoutem.com/support/sendbird-chat/';

class ChatSettingsPage extends Component {
  static propTypes = {
    enabled: PropTypes.bool,
    shoutemAppId: PropTypes.string,
    loadAppModules: PropTypes.func,
    extension: PropTypes.object,
    appId: PropTypes.string,
    fetchExtensionAction: PropTypes.func,
    updateExtensionSettingsAction: PropTypes.func,
    activateChatModule: PropTypes.func,
  };

  constructor(props) {
    super(props);

    autoBindReact(this);

    props.fetchExtensionAction();

    this.state = {
      initialLoading: true,
      error: '',
      appId: _.get(props.extension, 'settings.appId'),
      hasChanges: false,
    };
  }

  componentDidMount() {
    const { loadAppModules, shoutemAppId } = this.props;

    loadAppModules(shoutemAppId)
      .then(() => this.setState({ initialLoading: false }))
      .catch(() => this.setState({ initialLoading: false }));
  }

  componentWillReceiveProps(nextProps) {
    const { extension, fetchExtensionAction } = this.props;
    const { extension: nextExtension } = nextProps;

    if (extension !== nextExtension && shouldRefresh(nextExtension)) {
      fetchExtensionAction();
    }
  }

  handleAppIdChange(event) {
    const { appId } = this.props;
    const newText = event.target.value;
    const hasChanges = !_.isEqual(appId, newText);

    this.setState({
      appId: event.target.value,
      hasChanges,
    });
  }

  handleChatEnable() {
    const { activateChatModule, shoutemAppId, loadAppModules } = this.props;

    return activateChatModule(shoutemAppId).then(() => loadAppModules(shoutemAppId));
  }

  handleSubmit(event) {
    event.preventDefault();
    this.handleSave();
  }

  saveEnabled() {
    const { hasChanges, appId, inProgress } = this.state;

    return hasChanges && !_.isEmpty(appId) && !inProgress;
  }

  handleSave() {
    const { appId } = this.state;
    const {
      extension,
      updateExtensionSettingsAction,
    } = this.props;

    this.setState({
      error: '',
      inProgress: true,
    });

    SendBird.init(appId)
      .then(() => updateExtensionSettingsAction(extension, { appId }))
      .then(() => this.setState({ hasChanges: false, inProgress: false }))
      .catch(() => {
        this.setState({
          error: ERROR_APP_ID,
          inProgress: false,
        });
      });
  }

  render() {
    const { error, inProgress, appId, initialLoading } = this.state;
    const { enabled } = this.props;

    const disabled = !this.saveEnabled();

    if (initialLoading) {
      return <LoaderContainer isLoading />;
    }

    if (!enabled) {
      return <ChatDisabledPlaceholder onEnable={this.handleChatEnable} />;
    }

    return (
      <div>
        <div className="chat-settings-page">
          <form onSubmit={this.handleSubmit}>
            <h3>SendBird settings</h3>
            <FormGroup>
              <ControlLabel>App ID</ControlLabel>
              <FormControl
                className="form-control"
                onChange={this.handleAppIdChange}
                type="text"
                value={appId}
              />
            </FormGroup>
            {error && <HelpBlock className="text-error">{error}</HelpBlock>
            }
          </form>
          <ButtonToolbar>
            <Button
              bsStyle="primary"
              disabled={disabled}
              onClick={this.handleSave}
            >
              <LoaderContainer isLoading={inProgress}>
                Save
              </LoaderContainer>
            </Button>
          </ButtonToolbar>
        </div>
        <CollapsiblePanel />
        <div className="invitation-alert">
          {'Please invite shoutem admin to your Sendbird account so we can configure push notifications for your chats. '}
          <a href={ACCOUNT_INVITATION_SUPPORT_PAGE} rel="noopener noreferrer" target="_blank">Learn more</a>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state, ownProps) {
  const { extensionName } = ownProps;
  const extension = getExtension(state, extensionName);
  const appId = _.get(extension, 'settings.appId');
  const shoutemAppId = _.get(extension, 'app');

  return {
    extension,
    appId,
    shoutemAppId,
    enabled: selectors.isChatModuleActive(state),
  };
}

function mapDispatchToProps(dispatch, ownProps) {
  const { extensionName } = ownProps;

  return {
    fetchExtensionAction: () => dispatch(fetchExtension(extensionName)),
    updateExtensionSettingsAction: (extension, settings) => (
      dispatch(updateExtensionSettings(extension, settings))
    ),
    loadAppModules: appId => dispatch(actions.loadAppModules(appId)),
    activateChatModule: appId => dispatch(actions.activateChatModule(appId)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ChatSettingsPage);
