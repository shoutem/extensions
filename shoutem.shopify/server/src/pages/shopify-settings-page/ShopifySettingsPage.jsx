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
import {
  validateShopifySettings,
  validateShopifyStoreUrl,
  resolveShopifyStoreUrl,
} from 'src/modules/shopify';
import { DEFAULT_EXTENSION_SETTINGS } from '../../const';
import LOCALIZATION from './localization';
import './style.scss';

class ShopifySettingsPage extends Component {
  static propTypes = {
    extension: PropTypes.object,
    fetchExtension: PropTypes.func,
    updateExtensionSettings: PropTypes.func,
    validateShopifySettings: PropTypes.func,
  };

  constructor(props) {
    super(props);
    autoBindReact(this);

    this.ERROR_STORE_URL = i18next.t(LOCALIZATION.ERROR_STORE_URL);
    this.ERROR_SHOP = i18next.t(LOCALIZATION.ERROR_SHOP);

    props.fetchExtension();

    this.state = {
      error: '',
      inProgress: false,
      ...DEFAULT_EXTENSION_SETTINGS,
      ...props.extension.settings,
    };
  }

  componentWillReceiveProps(nextProps) {
    const { extension } = this.props;
    const { extension: nextExtension } = nextProps;

    if (extension !== nextExtension && shouldRefresh(nextExtension)) {
      this.props.fetchExtension();
    }
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
    const { store, apiKey, discountCode } = this.state;
    const {
      extension,
      validateShopifySettings,
      updateExtensionSettings,
    } = this.props;

    if (!validateShopifyStoreUrl(store)) {
      this.setState({ error: this.ERROR_STORE_URL });
      return;
    }

    const resolvedStore = resolveShopifyStoreUrl(store);

    this.setState({
      error: '',
      inProgress: true,
      store: resolvedStore,
    });

    validateShopifySettings(resolvedStore, apiKey)
      .then(() => updateExtensionSettings(extension, {
        apiKey,
        store: resolvedStore,
        discountCode,
      }))
      .then(() => this.setState({
        inProgress: false,
      }))
      .catch(() => {
        this.setState({
          error: this.ERROR_SHOP,
          inProgress: false,
        });
      });
  }

  render() {
    const {
      error,
      inProgress,
      store,
      apiKey,
      discountCode,
    } = this.state;
    const { extension: { settings } } = this.props;
    console.log(this.props);

    const newSettings = _.omit(this.state, ['inProgress', 'error']);
    const oldSettings = { ...DEFAULT_EXTENSION_SETTINGS, ...settings };
    const hasMandatoryFields = !_.isEmpty(store) && !_.isEmpty(apiKey);

    const allShortcutsNote = i18next.t(LOCALIZATION.ALL_SHORTCUTS_NOTE);
    const saveDisabled = _.isEqual(newSettings, oldSettings) || inProgress || !hasMandatoryFields;

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
              {i18next.t(LOCALIZATION.STORE_ACCESS_TOKEN)}
            </ControlLabel>
            <FormControl
              type="text"
              className="form-control"
              value={apiKey}
              onChange={this.handleTextSettingChange('apiKey')}
            />
            <div className="note">{allShortcutsNote}</div>
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
            <LoaderContainer isLoading={inProgress}>
              {i18next.t(LOCALIZATION.BUTTON_SAVE)}
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
    validateShopifySettings: (store, apiKey) =>
      dispatch(
        validateShopifySettings(store, apiKey, {
          extensionName,
        }),
      ),
    updateExtensionSettings: (extension, settings) =>
      dispatch(updateExtensionSettings(extension, settings)),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ShopifySettingsPage);
