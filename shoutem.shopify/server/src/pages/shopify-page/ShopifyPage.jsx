import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import autoBindReact from 'auto-bind/react';
import i18next from 'i18next';
import { FormGroup, Pager } from 'react-bootstrap';
import { Checkbox, LoaderContainer } from '@shoutem/react-web-ui';
import { connect } from 'react-redux';
import { updateShortcutSettings } from '@shoutem/redux-api-sdk';
import {
  ShopPreview,
  getShopifyCollections,
  loadShopifyCollections,
} from 'src/modules/shopify';
import { navigateToSettings } from 'src/redux';
import ShopifySettingsPage from '../shopify-settings-page';
import LOCALIZATION from './localization';
import './style.scss';

class ShopifyPage extends Component {
  static propTypes = {
    store: PropTypes.string,
    apiKey: PropTypes.string,
    collections: PropTypes.array,
    selectedCollections: PropTypes.array,
    loadShopifyCollections: PropTypes.func,
    updateShortcutSettings: PropTypes.func,
    navigateToShopifySettings: PropTypes.func,
  };

  constructor(props) {
    super(props);
    autoBindReact(this);

    this.page = 1;
  }

  componentDidMount() {
    this.checkData(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.checkData(nextProps, this.props);
  }

  checkData(nextProps, props = {}) {
    const { store, apiKey } = props;
    const { store: nextStore, apiKey: nextApiKey } = nextProps;

    if (!nextStore || !nextApiKey) {
      return;
    }

    if (nextStore !== store || nextApiKey !== apiKey) {
      this.props.loadShopifyCollections(nextStore, nextApiKey);
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
      apiKey,
      collections,
      selectedCollections,
      loadShopifyCollections,
      store,
    } = this.props;

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
    const { apiKey, store, navigateToShopifySettings } = this.props;

    const isConfigured = apiKey && store;

    if (!isConfigured) {
      return <ShopifySettingsPage {...this.props} />;
    }

    return (
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
    );
  }
}

function mapStateToProps(state, ownProps) {
  const {
    ownExtension: { settings: extensionSettings },
    shortcut: { settings: shortcutSettings },
  } = ownProps;

  const store = _.get(extensionSettings, 'store');
  const apiKey = _.get(extensionSettings, 'apiKey');
  const selectedCollections = _.get(
    shortcutSettings,
    'selectedCollections',
    [],
  );

  return {
    store,
    apiKey,
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
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ShopifyPage);
