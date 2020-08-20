import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { FontIcon, FontIconPopover } from '@shoutem/react-web-ui';
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
import './style.scss';
import MessageWithLink from '../../components/message-with-link';

const ERROR_APP_ID = 'Invalid App ID';
const LEARN_MORE_TEXT = 'Learn more.';
const SUPPORT_ARTICLE_LINK = 'https://shoutem.com/support/video-call';
const AGORA_SETUP_MESSAGE =
  'Please add Agora App ID to enable video call feature.';

class AgoraSettingsPage extends Component {
  static propTypes = {
    extension: PropTypes.object,
    appId: PropTypes.string,
    fetchExtensionAction: PropTypes.func,
    updateExtensionSettingsAction: PropTypes.func,
  };

  constructor(props) {
    super(props);

    autoBindReact(this);

    props.fetchExtensionAction();

    this.state = {
      error: '',
      appId: _.get(props.extension, 'settings.appId'),
      hasChanges: false,
    };
  }

  componentWillReceiveProps(nextProps) {
    const { extension, fetchExtensionAction } = this.props;
    const { extension: nextExtension } = nextProps;

    if (extension !== nextExtension && shouldRefresh(nextExtension)) {
      fetchExtensionAction();
    }
  }

  handleAppIdTextChange(event) {
    const { appId } = this.props;
    const newText = event.target.value;
    const hasChanges = !_.isEqual(appId, newText);

    this.setState({
      appId: event.target.value,
      hasChanges,
    });
  }

  handleSubmit(event) {
    event.preventDefault();
    this.handleSave();
  }

  handleSave() {
    const { appId } = this.state;
    const { extension, updateExtensionSettingsAction } = this.props;

    this.setState({
      error: '',
      inProgress: true,
    });

    updateExtensionSettingsAction(extension, { appId })
      .then(() => this.setState({ hasChanges: false, inProgress: false }))
      .catch(() => {
        this.setState({
          error: ERROR_APP_ID,
          inProgress: false,
        });
      });
  }

  render() {
    const { error, hasChanges, inProgress, appId } = this.state;

    const saveDisabled = !hasChanges || inProgress || _.isEmpty(appId);

    return (
      <div className="agora-settings-page">
        <form onSubmit={this.handleSubmit}>
          <div className="agora-title-container">
            <h3>Agora settings </h3>
            <FontIconPopover
              delayHide={2000}
              hideOnMouseLeave={false}
              message={
                <MessageWithLink
                  message={AGORA_SETUP_MESSAGE}
                  link={SUPPORT_ARTICLE_LINK}
                  linkText={LEARN_MORE_TEXT}
                />
              }
            >
              <FontIcon className="font-icon" name="info" size="24px" />
            </FontIconPopover>{' '}
          </div>
          <FormGroup>
            <ControlLabel>Agora App ID</ControlLabel>
            <FormControl
              className="form-control"
              onChange={this.handleAppIdTextChange}
              type="text"
              value={appId}
            />
          </FormGroup>
          {error && <HelpBlock className="text-error">{error}</HelpBlock>}
        </form>
        <ButtonToolbar>
          <Button
            bsStyle="primary"
            disabled={saveDisabled}
            onClick={this.handleSave}
          >
            <LoaderContainer isLoading={inProgress}>Save</LoaderContainer>
          </Button>
        </ButtonToolbar>
      </div>
    );
  }
}

function mapStateToProps(state, ownProps) {
  const { extensionName } = ownProps;
  const extension = getExtension(state, extensionName);
  const appId = _.get(extension, 'settings.appId');

  return {
    extension,
    appId,
  };
}

function mapDispatchToProps(dispatch, ownProps) {
  const { extensionName } = ownProps;

  return {
    fetchExtensionAction: () => dispatch(fetchExtension(extensionName)),
    updateExtensionSettingsAction: (extension, settings) =>
      dispatch(updateExtensionSettings(extension, settings)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(AgoraSettingsPage);
