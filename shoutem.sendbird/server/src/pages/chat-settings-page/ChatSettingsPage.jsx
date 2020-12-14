import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
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
import {
  ChatDisabledPlaceholder,
  SubscriptionToggle,
  FairPolicyDescription,
  ModalDialog,
} from '../../components';
import LOCALIZATION from './localization';
import './style.scss';

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
    deactivateChatModule: PropTypes.func,
    validateSubscriptionStatus: PropTypes.func,
  };

  constructor(props) {
    super(props);

    autoBindReact(this);

    props.fetchExtensionAction();

    this.ERROR_APP_ID = i18next.t(LOCALIZATION.ERROR_APP_ID);
    this.ERROR_SUBSCRIPTION_INVALID = i18next.t(
      LOCALIZATION.ERROR_SUBSRIPTION_INVALID,
    );
    this.SUBSCRIPTION_OPTIONS = {
      SHOUTEM: i18next.t(LOCALIZATION.SUBSCRIPTION_OPTION_SHOUTEM),
      SENDBIRD: i18next.t(LOCALIZATION.SUBSCRIPTION_OPTION_SENDBIRD),
    };
    this.NEW_KEY_MODAL_TEXT = {
      modalTitle: i18next.t(LOCALIZATION.NEW_KEY_WARNING_TITLE),
      modalDescription: i18next.t(LOCALIZATION.NEW_KEY_WARNING_DESCRIPTION),
    };
    this.CONVERT_TO_CUSTOM_KEYS_MODAL_TEXT = {
      modalTitle: i18next.t(LOCALIZATION.CUSTOM_KEY_WARNING_TITLE),
      modalDescription: i18next.t(LOCALIZATION.CUSTOM_KEY_WARNING_DESCRIPTION),
    };

    this.state = {
      initialLoading: true,
      error: '',
      appId: _.get(props.extension, 'settings.appId'),
      selectedOption: this.SUBSCRIPTION_OPTIONS.SHOUTEM,
      subscriptionValid: false,
      modalActive: false,
      disabling: false,
      onCancel: this.handleModalCancellation,
    };
  }

  componentDidMount() {
    const { loadAppModules, shoutemAppId } = this.props;

    loadAppModules(shoutemAppId)
      .then(this.resolveAppSubscription)
      .then(this.handleModulesLoaded)
      .catch(this.handleModulesLoaded);
  }

  componentWillReceiveProps(nextProps) {
    const { extension, fetchExtensionAction } = this.props;
    const { extension: nextExtension } = nextProps;

    if (extension !== nextExtension && shouldRefresh(nextExtension)) {
      fetchExtensionAction();
    }
  }

  resolveAppSubscription() {
    const { validateSubscriptionStatus, shoutemAppId } = this.props;

    return validateSubscriptionStatus(shoutemAppId).then(subscriptionValid =>
      this.setState({ subscriptionValid }),
    );
  }

  handleModulesLoaded() {
    const { appId } = this.props;
    const { subscriptionValid } = this.state;

    const usesPersonalAccount = !_.isEmpty(appId);
    const error =
      !usesPersonalAccount && !subscriptionValid
        ? this.ERROR_SUBSCRIPTION_INVALID
        : '';

    const selectedOption = usesPersonalAccount
      ? this.SUBSCRIPTION_OPTIONS.SENDBIRD
      : this.SUBSCRIPTION_OPTIONS.SHOUTEM;

    this.setState({ initialLoading: false, selectedOption, error });
  }

  handleSubscriptionChange(selectedOption) {
    const { appId } = this.props;
    const { subscriptionValid } = this.state;

    const isShoutemOption =
      selectedOption === this.SUBSCRIPTION_OPTIONS.SHOUTEM;
    const modalActive = !isShoutemOption && _.isEmpty(appId);

    const newAppId = isShoutemOption ? '' : appId;
    const error =
      isShoutemOption && !subscriptionValid
        ? this.ERROR_SUBSCRIPTION_INVALID
        : '';

    this.setState({
      appId: newAppId,
      selectedOption,
      error,
      modalActive,
      onConfirm: this.handleModalCancellation,
      onCancel: () =>
        this.handleSubscriptionChange(this.SUBSCRIPTION_OPTIONS.SHOUTEM),
      ...(modalActive && this.CONVERT_TO_CUSTOM_KEYS_MODAL_TEXT),
    });
  }

  handleAppIdChange(event) {
    this.setState({
      appId: event.target.value,
    });
  }

  handleModalCancellation() {
    this.setState({ modalActive: false });
  }

  handleChatEnable() {
    const {
      activateChatModule,
      shoutemAppId,
      loadAppModules,
      updateExtensionSettingsAction,
      extension,
    } = this.props;

    return activateChatModule(shoutemAppId).then(() => {
      loadAppModules(shoutemAppId);
      updateExtensionSettingsAction(extension, { featureActive: true });
    });
  }

  handleChatDisable() {
    const {
      deactivateChatModule,
      shoutemAppId,
      loadAppModules,
      updateExtensionSettingsAction,
      extension,
    } = this.props;

    this.setState({ disabling: true });

    return deactivateChatModule(shoutemAppId)
      .then(() => loadAppModules(shoutemAppId))
      .then(() => {
        this.setState({ disabling: false });
        updateExtensionSettingsAction(extension, { featureActive: false });
      })
      .catch(() => this.setState({ disabling: false }));
  }

  handleSubmit(event) {
    event.preventDefault();
    this.handleSave();
  }

  saveEnabled() {
    const { appId: currentAppId } = this.props;
    const { appId, inProgress } = this.state;

    return !_.isEqual(appId, currentAppId) && !inProgress;
  }

  handleSavePress() {
    const { appId } = this.props;
    const { appId: newAppId } = this.state;

    if (!_.isEmpty(appId) && !_.isEmpty(newAppId)) {
      this.setState({
        ...this.NEW_KEY_MODAL_TEXT,
        modalActive: true,
        onConfirm: this.handleSave,
        onCancel: this.handleModalCancellation,
      });
      return;
    }

    this.handleSave();
  }

  handleSave() {
    const { appId, selectedOption } = this.state;
    const { extension, updateExtensionSettingsAction } = this.props;

    const shoutemSelected =
      selectedOption === this.SUBSCRIPTION_OPTIONS.SHOUTEM;

    this.setState({
      error: '',
      inProgress: true,
      modalActive: false,
    });

    if (!shoutemSelected) {
      return SendBird.init(appId)
        .then(() => updateExtensionSettingsAction(extension, { appId }))
        .then(() => this.setState({ inProgress: false }))
        .catch(() => {
          this.setState({
            error: this.ERROR_APP_ID,
            inProgress: false,
          });
        });
    }

    return updateExtensionSettingsAction(extension, { appId }).then(() =>
      this.setState({ inProgress: false }),
    );
  }

  render() {
    const {
      error,
      inProgress,
      disabling,
      appId,
      initialLoading,
      selectedOption,
      modalActive,
      modalDescription,
      modalTitle,
      onConfirm,
      onCancel,
    } = this.state;
    const { enabled } = this.props;

    const showAppIdField =
      selectedOption === this.SUBSCRIPTION_OPTIONS.SENDBIRD;
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
            <h3>{i18next.t(LOCALIZATION.DISABLE_TITLE)}</h3>
            <ButtonToolbar>
              <Button
                bsStyle="primary"
                disabled={disabling}
                onClick={this.handleChatDisable}
              >
                <LoaderContainer isLoading={disabling}>
                  {i18next.t(LOCALIZATION.DISABLE_BUTTON)}
                </LoaderContainer>
              </Button>
            </ButtonToolbar>
            <h3>{i18next.t(LOCALIZATION.TITLE)}</h3>
            <SubscriptionToggle
              onOptionSelected={this.handleSubscriptionChange}
              options={[
                this.SUBSCRIPTION_OPTIONS.SHOUTEM,
                this.SUBSCRIPTION_OPTIONS.SENDBIRD,
              ]}
              selectedOption={selectedOption}
            />
            {showAppIdField && (
              <FormGroup>
                <ControlLabel>{i18next.t(LOCALIZATION.APP_ID)}</ControlLabel>
                <FormControl
                  className="form-control"
                  onChange={this.handleAppIdChange}
                  type="text"
                  value={appId}
                />
              </FormGroup>
            )}
            <HelpBlock className="error-text">{error}</HelpBlock>
          </form>
          <ButtonToolbar>
            <Button
              bsStyle="primary"
              disabled={disabled}
              onClick={this.handleSavePress}
            >
              <LoaderContainer isLoading={inProgress}>
                {i18next.t(LOCALIZATION.SAVE)}
              </LoaderContainer>
            </Button>
          </ButtonToolbar>
        </div>
        <FairPolicyDescription />
        <ModalDialog
          active={modalActive}
          description={modalDescription}
          onCancel={onCancel}
          onConfirm={onConfirm}
          title={modalTitle}
        />
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
    updateExtensionSettingsAction: (extension, settings) =>
      dispatch(updateExtensionSettings(extension, settings)),
    validateSubscriptionStatus: appId =>
      dispatch(actions.validateSubscriptionStatus(appId)),
    loadAppModules: appId => dispatch(actions.loadAppModules(appId)),
    activateChatModule: appId => dispatch(actions.activateChatModule(appId)),
    deactivateChatModule: appId => dispatch(actions.deactivateChatModule(appId)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ChatSettingsPage);
