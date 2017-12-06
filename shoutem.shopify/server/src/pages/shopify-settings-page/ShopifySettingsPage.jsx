import React, { Component, PropTypes } from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';
import {
  Button,
  ButtonToolbar,
  ControlLabel,
  FormControl,
  FormGroup,
  HelpBlock,
} from 'react-bootstrap';
import { LoaderContainer } from '@shoutem/react-web-ui';
import { updateExtensionSettings } from '@shoutem/redux-api-sdk';
import {
  validateShopifySettings,
  validateShopifyStoreUrl,
  resolveShopifyStoreUrl,
} from 'src/modules/shopify';

const ERROR_STORE_URL = 'Invalid store URL';
const ERROR_SHOP = 'We can\'t reach the shop. Please check your store URL and API key.';

class ShopifySettingsPage extends Component {
  static propTypes = {
    ownExtension: PropTypes.object,
    updateExtensionSettings: PropTypes.func,
    validateShopifySettings: PropTypes.func,
  };

  constructor(props) {
    super(props);

    this.handleApiKeyTextChange = this.handleApiKeyTextChange.bind(this);
    this.handleStoreTextChange = this.handleStoreTextChange.bind(this);
    this.handleSave = this.handleSave.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

    const settings = _.get(props, 'ownExtension.settings');

    this.state = {
      error: '',
      store: _.get(settings, 'store'),
      apiKey: _.get(settings, 'apiKey'),
      hasChanges: false,
    };
  }

  componentWillReceiveProps(nextProps) {
    const { ownExtension: nextOwnExtension } = nextProps;
    const { store, apiKey } = this.state;

    if (_.isEmpty(store)) {
      this.setState({
        store: _.get(nextOwnExtension, 'settings.store'),
      });
    }

    if (_.isEmpty(apiKey)) {
      this.setState({
        apiKey: _.get(nextOwnExtension, 'settings.apiKey'),
      });
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

    this.props.validateShopifySettings(resolvedStore, apiKey).then(() => {
      this.setState({
        hasChanges: false,
        inProgress: false,
      });
      return this.props.updateExtensionSettings({ apiKey, store: resolvedStore });
    }).catch(() => {
      this.setState({
        error: ERROR_SHOP,
        inProgress: false,
      });
    });
  }

  render() {
    const { error, hasChanges, inProgress, store, apiKey } = this.state;

    return (
      <div className="shopify-settings-page settings-page">
        <form onSubmit={this.handleSubmit}>
          <FormGroup>
            <h3>General settings</h3>
            <ControlLabel>Store URL (e.g. mystore.myshopify.com)</ControlLabel>
            <FormControl
              type="text"
              className="form-control"
              value={store}
              onChange={this.handleStoreTextChange}
            />
            <ControlLabel>Your API key for mobile sales channel</ControlLabel>
            <FormControl
              type="text"
              className="form-control"
              value={apiKey}
              onChange={this.handleApiKeyTextChange}
            />
            <ControlLabel>
              This extension will use the same Shopify store for all screens in the app
            </ControlLabel>
          </FormGroup>
          <HelpBlock className="text-error">
            {error}
          </HelpBlock>
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

function mapDispatchToProps(dispatch, ownProps) {
  const { ownExtensionName, ownExtension } = ownProps;
  const scope = { extensionName: ownExtensionName };

  return {
    validateShopifySettings: (store, apiKey) => (
      dispatch(validateShopifySettings(store, apiKey, scope))
    ),
    updateExtensionSettings: (settings) => (
      dispatch(updateExtensionSettings(ownExtension, settings))
    ),
  };
}

export default connect(null, mapDispatchToProps)(ShopifySettingsPage);
