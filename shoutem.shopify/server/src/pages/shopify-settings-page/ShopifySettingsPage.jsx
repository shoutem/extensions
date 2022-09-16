import React, { Component } from 'react';
import {
  Button,
  ButtonToolbar,
  ControlLabel,
  FormControl,
  FormGroup,
  HelpBlock,
} from 'react-bootstrap';
import { connect } from 'react-redux';
import autoBindReact from 'auto-bind/react';
import i18next from 'i18next';
import _ from 'lodash';
import PropTypes from 'prop-types';
import {
  checkShopConnection,
  connectShop,
  createStorefrontToken,
  getStorefrontToken,
  validateShopifyStoreUrl,
} from 'src/modules/shopify';
import { LoaderContainer } from '@shoutem/react-web-ui';
import {
  fetchExtension,
  getExtension,
  updateExtensionSettings,
} from '@shoutem/redux-api-sdk';
import { shouldRefresh } from '@shoutem/redux-io';
import errorState from '../../../assets/errorState.png';
import successState from '../../../assets/successState.png';
import { DEFAULT_EXTENSION_SETTINGS } from '../../const';
import LOCALIZATION from './localization';
import './style.scss';

class ShopifySettingsPage extends Component {
  static propTypes = {
    checkShopConnection: PropTypes.func.isRequired,
    connectShop: PropTypes.func.isRequired,
    createStorefrontToken: PropTypes.func.isRequired,
    extension: PropTypes.object.isRequired,
    fetchExtension: PropTypes.func.isRequired,
    getStorefrontToken: PropTypes.func.isRequired,
    settings: PropTypes.object.isRequired,
    updateExtensionSettings: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    autoBindReact(this);

    this.ERROR_STORE_URL = i18next.t(LOCALIZATION.ERROR_STORE_URL);
    this.ERROR_SHOP = i18next.t(LOCALIZATION.ERROR_SHOP);

    this.state = {
      error: '',
      loading: true,
      checkingConnection: false,
      checkingApiKey: false,
      connecting: false,
      creatingApiKey: false,
      connected: false,
      apiKey: '',
      ...DEFAULT_EXTENSION_SETTINGS,
      ...props.extension.settings,
    };
  }

  componentDidMount() {
    const { fetchExtension } = this.props;

    window.addEventListener('focus', this.handleFocus);

    fetchExtension()
      .then(() =>
        Promise.all([
          this.handleShopConnectionCheck(),
          this.handleStorefrontKeyCheck(),
        ]),
      )
      .finally(() => this.setState({ loading: false }));
  }

  componentWillUnmount() {
    window.removeEventListener('focus', this.handleFocus);
  }

  componentWillReceiveProps(nextProps) {
    const { extension, fetchExtension } = this.props;
    const { extension: nextExtension } = nextProps;

    if (extension !== nextExtension && shouldRefresh(nextExtension)) {
      fetchExtension();
    }
  }

  handleFocus() {
    const { connecting } = this.state;

    if (!connecting) {
      return;
    }

    this.handleShopConnectionCheck().then(() =>
      this.setState({ connecting: false }),
    );
  }

  handleShopConnectionCheck() {
    const { checkShopConnection } = this.props;
    const {
      settings: { store },
    } = this.props;

    if (!store) {
      return null;
    }

    this.setState({ checkingConnection: true });

    return checkShopConnection(store)
      .then(({ authorized }) =>
        this.setState({
          connected: authorized,
        }),
      )
      .finally(() => this.setState({ checkingConnection: false }));
  }

  handleConnectPress() {
    const { connectShop } = this.props;
    const { store } = this.state;

    this.setState({ connecting: true });

    return connectShop(store);
  }

  handleStorefrontKeyCheck() {
    const { getStorefrontToken } = this.props;
    const {
      settings: { store },
    } = this.props;

    if (!store) {
      return;
    }

    this.setState({ checkingApiKey: true });

    getStorefrontToken(store)
      .then(tokenData => {
        if (_.isEmpty(tokenData)) {
          return this.setState({ apiKey: '' });
        }

        return this.setState({ apiKey: tokenData.access_token });
      })
      .finally(() => this.setState({ checkingApiKey: false }));
  }

  handleCreateStorefrontKey() {
    const { createStorefrontToken, settings } = this.props;
    const { store } = settings;

    this.setState({ creatingApiKey: true });

    createStorefrontToken(store)
      .then(tokenData => this.setState({ apiKey: tokenData.access_token }))
      .finally(() => this.setState({ creatingApiKey: false }));
  }

  handleTextSettingChange(fieldName) {
    return event => {
      const newText = event.target.value;

      this.setState({ [fieldName]: newText });
    };
  }

  handleSubmit(event) {
    event.preventDefault();

    this.handleSave();
  }

  handleSave() {
    const { store, discountCode } = this.state;
    const { extension, updateExtensionSettings } = this.props;

    if (!validateShopifyStoreUrl(store)) {
      this.setState({ error: this.ERROR_STORE_URL });
      return;
    }

    this.setState({
      error: '',
      loading: true,
    });

    updateExtensionSettings(extension, {
      store,
      discountCode,
    })
      .then(() =>
        Promise.all([
          this.handleShopConnectionCheck(),
          this.handleStorefrontKeyCheck(),
        ]),
      )
      .then(() =>
        this.setState({
          loading: false,
        }),
      )
      .catch(() => {
        this.setState({
          error: this.ERROR_SHOP,
          loading: false,
        });
      });
  }

  render() {
    const {
      error,
      loading,
      store,
      discountCode,
      connected,
      connecting,
      checkingConnection,
      apiKey,
      checkingApiKey,
      creatingApiKey,
    } = this.state;
    const { settings } = this.props;
    const { store: savedStore, discountCode: savedDiscountCode } = settings;

    const hasMandatoryFields = !_.isEmpty(store);

    const connectButtonTitle = connected
      ? i18next.t(LOCALIZATION.CONNECT_BUTTON_RECONNECT)
      : i18next.t(LOCALIZATION.CONNECT_BUTTON_CONNECT);

    const apiKeyButtonTitle = !apiKey
      ? i18next.t(LOCALIZATION.API_KEY_BUTTON_CREATE)
      : i18next.t(LOCALIZATION.API_KEY_BUTTON_RECREATE);

    const saveDisabled =
      (_.isEqual(store, savedStore) &&
        _.isEqual(discountCode, savedDiscountCode)) ||
      loading ||
      !hasMandatoryFields;
    const connectDisabled =
      !savedStore || loading || connecting || checkingConnection;
    const createApiKeyDisabled =
      checkingApiKey || creatingApiKey || !connected || loading;

    return (
      <div className="shopify-settings-page">
        <form onSubmit={this.handleSubmit}>
          <h3>{i18next.t(LOCALIZATION.FORM_TITLE)}</h3>
          <FormGroup>
            <ControlLabel>
              {i18next.t(LOCALIZATION.STORE_URL_LABEL)}
            </ControlLabel>
            <FormControl
              type="text"
              className="form-control"
              value={store}
              onChange={this.handleTextSettingChange('store')}
            />
            <ControlLabel>
              {i18next.t(LOCALIZATION.DISCOUNT_CODE_LABEL)}
            </ControlLabel>
            <FormControl
              type="text"
              className="form-control"
              value={discountCode}
              onChange={this.handleTextSettingChange('discountCode')}
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
            <LoaderContainer isLoading={loading}>
              {i18next.t(LOCALIZATION.BUTTON_SAVE)}
            </LoaderContainer>
          </Button>
        </ButtonToolbar>
        <ControlLabel>
          {i18next.t(LOCALIZATION.CONNECT_SHOP_DESCRIPTION)}
        </ControlLabel>
        <ButtonToolbar>
          <Button
            bsStyle="primary"
            disabled={connectDisabled}
            onClick={this.handleConnectPress}
          >
            <LoaderContainer isLoading={connecting || checkingConnection}>
              {connectButtonTitle}
            </LoaderContainer>
          </Button>
          {connected && <img src={successState} alt="successState" />}
          {!connected && <img src={errorState} alt="errorState" />}
        </ButtonToolbar>
        <FormGroup>
          <ControlLabel>
            {i18next.t(LOCALIZATION.API_KEY_CREATE_DESCRIPTION)}
          </ControlLabel>
          <FormControl
            type="text"
            disabled
            className="form-control"
            value={apiKey}
          />
          <ButtonToolbar>
            <Button
              bsStyle="primary"
              disabled={createApiKeyDisabled}
              onClick={this.handleCreateStorefrontKey}
            >
              <LoaderContainer isLoading={checkingApiKey || creatingApiKey}>
                {apiKeyButtonTitle}
              </LoaderContainer>
            </Button>
            {apiKey && <img src={successState} alt="successState" />}
            {!apiKey && <img src={errorState} alt="errorState" />}
          </ButtonToolbar>
        </FormGroup>
      </div>
    );
  }
}

function mapStateToProps(state, ownProps) {
  const { extensionName } = ownProps;

  const extension = getExtension(state, extensionName);
  const { settings } = extension;

  return {
    extension: getExtension(state, extensionName),
    settings,
  };
}

function mapDispatchToProps(dispatch, ownProps) {
  const { extensionName, appId } = ownProps;

  return {
    fetchExtension: () => dispatch(fetchExtension(extensionName)),
    updateExtensionSettings: (extension, settings) =>
      dispatch(updateExtensionSettings(extension, settings)),
    checkShopConnection: shop => dispatch(checkShopConnection(shop)),
    connectShop: shop => dispatch(connectShop(shop)),
    getStorefrontToken: shop => dispatch(getStorefrontToken(appId, shop)),
    createStorefrontToken: shop => dispatch(createStorefrontToken(appId, shop)),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ShopifySettingsPage);
