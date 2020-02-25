import React, { Component, PropTypes } from 'react';
import _ from 'lodash';
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
import {
  validateShopifySettings,
  validateShopifyStoreUrl,
  resolveShopifyStoreUrl,
} from 'src/modules/shopify';
import './style.scss';

const ERROR_STORE_URL = 'Invalid store URL';
const ERROR_SHOP = 'We can\'t reach the shop. ' +
  'Please check your store URL and Storefront access token.';

class ShopifySettingsPage extends Component {
  static propTypes = {
    extension: PropTypes.object,
    fetchExtension: PropTypes.func,
    updateExtensionSettings: PropTypes.func,
    validateShopifySettings: PropTypes.func,
  };

  constructor(props) {
    super(props);

    this.handleApiKeyTextChange = this.handleApiKeyTextChange.bind(this);
    this.handleStoreTextChange = this.handleStoreTextChange.bind(this);
    this.handleSave = this.handleSave.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

    props.fetchExtension();

    this.state = {
      error: '',
      store: _.get(props.extension, 'settings.store'),
      apiKey: _.get(props.extension, 'settings.apiKey'),
      hasChanges: false,
    };
  }

  componentWillReceiveProps(nextProps) {
    const { extension } = this.props;
    const { extension: nextExtension } = nextProps;
    const { store, apiKey} = this.state;

    if (_.isEmpty(store)) {
      this.setState({
        store: _.get(nextExtension, 'settings.store'),
      });
    }

    if (_.isEmpty(apiKey)) {
      this.setState({
        apiKey: _.get(nextExtension, 'settings.apiKey'),
      });
    }

    if (extension !== nextExtension && shouldRefresh(nextExtension)) {
      this.props.fetchExtension();
    }
  }

  handleStoreTextChange(event) {
    this.setState({
      hasChanges: true,
      store: event.target.value,
    });
  }


  handleApiKeyTextChange(event) {
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
    const { store, apiKey } = this.state;
    const {
      extension,
      validateShopifySettings,
      updateExtensionSettings,
    } = this.props;

    if (!validateShopifyStoreUrl(store)) {
      this.setState({ error: ERROR_STORE_URL });
      return;
    }

    const resolvedStore = resolveShopifyStoreUrl(store);

    this.setState({
      error: '',
      inProgress: true,
      store: resolvedStore,
    });

    validateShopifySettings(resolvedStore, apiKey).then(() => {
      this.setState({
        hasChanges: false,
        inProgress: false,
      });
      return updateExtensionSettings(extension, { apiKey, store: resolvedStore });
    }).catch(() => {
      this.setState({
        error: ERROR_SHOP,
        inProgress: false,
      });
    });
  }

  render() {
    const { error, hasChanges, inProgress, store, apiKey } = this.state;

    const allShortcutsNote = 'Note: This extension will use the same Shopify '
    + 'store for all screens in the app.';

    return (
      <div className="shopify-settings-page">
        <form onSubmit={this.handleSubmit}>
          <h3>Store settings</h3>
          <FormGroup>
            <ControlLabel>Store URL (e.g. mystore.myshopify.com)</ControlLabel>
            <FormControl
              type="text"
              className="form-control"
              value={store}
              onChange={this.handleStoreTextChange}
            />
            <ControlLabel>Storefront access token</ControlLabel>
            <FormControl
              type="text"
              className="form-control"
              value={apiKey}
              onChange={this.handleApiKeyTextChange}
            />
            <div style={{marginTop: '5px'}}>{allShortcutsNote}</div>
          </FormGroup>
          {error &&
            <HelpBlock className="text-error">{error}</HelpBlock>
          }
        </form>
        <ButtonToolbar>
          <Button
            bsStyle="primary"
            disabled={!hasChanges}
            onClick={this.handleSave}
          >
            <LoaderContainer isLoading={inProgress}>
              Save
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
    validateShopifySettings: (store, apiKey) => (
      dispatch(
        validateShopifySettings(
          store,
          apiKey,
          { extensionName: extensionName }
        )
      )
    ),
    updateExtensionSettings: (extension, settings) => (
      dispatch(updateExtensionSettings(extension, settings))
    ),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ShopifySettingsPage);
