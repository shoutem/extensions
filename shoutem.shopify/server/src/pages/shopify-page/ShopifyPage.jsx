import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import autoBindReact from 'auto-bind/react';
import i18next from 'i18next';
import { FormGroup, Pager, ControlLabel, } from 'react-bootstrap';
import { Checkbox, LoaderContainer } from '@shoutem/react-web-ui';
import { connect } from 'react-redux';
import { updateShortcutSettings } from '@shoutem/redux-api-sdk';
import {
  ShopPreview,
  getShopifyCollections,
  loadShopifyCollections,
  getStorefrontToken,
} from 'src/modules/shopify';
import { navigateToSettings } from 'src/redux';
import LOCALIZATION from './localization';
import './style.scss';

class ShopifyPage extends Component {
  static propTypes = {
    store: PropTypes.string,
    collections: PropTypes.array,
    selectedCollections: PropTypes.array,
    loadShopifyCollections: PropTypes.func,
    updateShortcutSettings: PropTypes.func,
    navigateToShopifySettings: PropTypes.func,
    getStorefrontToken: PropTypes.func,
  };

  constructor(props) {
    super(props);
    autoBindReact(this);

    this.page = 1;
    
    this.state = {
      apiKey: '',
      loading: true,
    };
  }

  componentDidMount() {
    const { getStorefrontToken, store, loadShopifyCollections } = this.props;
    
    getStorefrontToken(store)
    .then(tokenData => {
      if (!_.isEmpty(tokenData) && store) {
        this.setState({ apiKey: tokenData.access_token });

        return loadShopifyCollections(store, tokenData.access_token);
      }
    })
    .finally(() => this.setState({ loading: false }));
  }

  componentWillReceiveProps(nextProps) {
    this.checkData(nextProps, this.props);
  }

  checkData(nextProps, props = {}) {
    const { store } = props;
    const { apiKey } = this.state;
    const { store: nextStore } = nextProps;

    if (!nextStore || !apiKey) {
      return;
    }

    if (nextStore !== store) {
      this.props.loadShopifyCollections(nextStore, apiKey);
    }
  }

  handleCollectionSelection(event) {
    if (!event.target) {
      return;
    }

    const { checked, id } = event.target;
    const selectedCollectionId = parseInt(id, 10);

    const { selectedCollections } = this.props;

    const newSelectedCollections = checked
      ? _.union(selectedCollections, [selectedCollectionId])
      : _.without(selectedCollections, selectedCollectionId);

    this.props.updateShortcutSettings({
      selectedCollections: newSelectedCollections,
    });
  }

  renderShopifyCollections() {
    const {
      collections,
      selectedCollections,
      loadShopifyCollections,
      store,
    } = this.props;
    const { apiKey } = this.state;

    if (collections.length === 0) {
      return <LoaderContainer size="50px" isLoading />;
    }

    return (
      <div>
        {_.map(collections, collection => {
          const { collection_id: collectionId, title } = collection;

          return (
            <Checkbox
              id={collectionId}
              key={collectionId}
              checked={_.includes(selectedCollections, collectionId)}
              onChange={this.handleCollectionSelection}
            >
              {title}
            </Checkbox>
          );
        })}
        <Pager style={{ marginTop: '30px' }}>
          <Pager.Item
            previous
            disabled={this.page === 1}
            onClick={() => {
              this.page--;
              loadShopifyCollections(store, apiKey, this.page);
            }}
          >
            &larr; {i18next.t(LOCALIZATION.PREVIOUS_PAGE)}
          </Pager.Item>
          <Pager.Item
            next
            disabled={collections.length < 250}
            onClick={() => {
              this.page++;
              loadShopifyCollections(store, apiKey, this.page);
            }}
          >
            {i18next.t(LOCALIZATION.NEXT_PAGE)} &rarr;
          </Pager.Item>
        </Pager>
      </div>
    );
  }

  render() {
    const { store, navigateToShopifySettings } = this.props;
    const { apiKey, loading } = this.state;

    if (!loading && (!apiKey || !store)) {
      return (
        <FormGroup>
          <ControlLabel>
            {i18next.t(LOCALIZATION.SHOP_NOT_CONFIGURED)}
            <a href="#" onClick={navigateToShopifySettings}>
              {i18next.t(LOCALIZATION.SHOP_NOT_CONFIGURED_LINK)}
            </a>
          </ControlLabel>
        </FormGroup>
      )
    }

    return (
      <LoaderContainer isLoading={loading}>
        <div className="shopify-page settings-page">
          <ShopPreview
            store={store}
            onNavigateToShopifySettingsClick={navigateToShopifySettings}
          />
          <form>
            <h3>{i18next.t(LOCALIZATION.FORM_TITLE)}</h3>
            <h5>{i18next.t(LOCALIZATION.FORM_DESCIRPTION)}</h5>
            <FormGroup>{this.renderShopifyCollections()}</FormGroup>
          </form>
        </div>
      </LoaderContainer>
    );
  }
}

function mapStateToProps(state, ownProps) {
  const {
    ownExtension: { settings: extensionSettings },
    shortcut: { settings: shortcutSettings },
  } = ownProps;

  const store = _.get(extensionSettings, 'store');
  const selectedCollections = _.get(
    shortcutSettings,
    'selectedCollections',
    [],
  );

  return {
    store,
    selectedCollections,
    collections: getShopifyCollections(state),
  };
}

function mapDispatchToProps(dispatch, ownProps) {
  const { ownExtensionName, shortcut, appId } = ownProps;
  const scope = { extensionName: ownExtensionName };

  return {
    loadShopifyCollections: (store, apiKey, page) =>
      dispatch(loadShopifyCollections(store, apiKey, scope, page || 1)),
    updateShortcutSettings: settings =>
      dispatch(updateShortcutSettings(shortcut, settings)),
    navigateToShopifySettings: () =>
      dispatch(navigateToSettings(appId, ownExtensionName)),
    getStorefrontToken: store => dispatch(getStorefrontToken(appId, store)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ShopifyPage);
